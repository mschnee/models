import { MongoClient } from 'mongodb';
import { MigrationInterface, QueryRunner } from 'typeorm';

const BASE_QUERY = `INSERT INTO "call" ("is_from_migration", "original_call_id", "created_at", "created_by_oid", "invitee_oid", "host_oid", "company_oid", "invitee_email", "calendly_id", "invitee_calendly_id", "call_scheduled_for", "call_kind_id", "phone_number", "type", "updated_at", "deleted_at", "status") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id`;

export class v2_3_0_data__1601509875121 implements MigrationInterface {
  name = 'v2.3.0 (data) 1601509875121';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const mongoClient = await MongoClient.connect(process.env.MONGO_URL);
    const companyCursor = mongoClient.db().collection('companies').find().batchSize(100);

    async function runQuery(company, call, callType) {
      const res = await queryRunner.query(`SELECT id FROM "call" WHERE "original_call_id" = $1`, [call._id.toString()]);
      if (res?.length) {
        console.log(`Record for original id ${call._id.toString()} already exists`);
        return;
      }
      if (!kindIDs[call.kind]) {
        const kindResult = await queryRunner.query(`SELECT id FROM "call_kind" WHERE "kind" = $1`, [call.kind]);
        if (kindResult?.length) {
          kindIDs[call.kind] = kindResult[0].id;
        } else {
          const insertResult = await queryRunner.query(`INSERT INTO "call_kind" ("kind") VALUES ($1) RETURNING id`, [
            call.kind,
          ]);
          kindIDs[call.kind] = insertResult[0].id;
        }
      }
      const kindId = kindIDs[call.kind];
      const callResult = await queryRunner.query(BASE_QUERY, [
        true,
        /* original_call_id: */ call._id.toString(),
        /* createdAt: */ call.created_at,
        /* _createdBy: */ call._created_by?.toString(),
        /* _invitee: */ call._invitee?.toString(),
        /* _host: */ call._host?.toString(),
        /* _company: */ company._id.toString(),
        /* inviteeEmail: */ call._inviteeEmail,
        /* calendlyId: */ call.calendlyId,
        /* calendlyInviteeId: */ call.calendlyInviteeId,
        /* callScheduledFor: */ call.time,
        /* kind: */ kindId,
        /* phoneNumber: */ call.phone,
        /* type: */ callType, // call.notes.join('\n'),
        /* notes: */ /* updateAt: */ call.updated_at,
        /* deletedAt: */ call.deleted_at,
        /* status */ call.status,
      ]);
      const callId = callResult[0].id;

      if (call.notes?.length > 0) {
        for (const note of call.notes) {
          const noteResult = await queryRunner.query(
            `INSERT INTO "call_note" ("mongo_oid", "user_mongo_oid", "pinned", "text", "created_at", "call_id") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [
              note._id?.toString() ?? 'undefined-in-mongo',
              note._user?.toString() ?? 'undefined-in-mongo',
              note.pinned ?? false,
              note.text,
              note.timestamp ?? call.created_at ?? call.updated_at,
              callId,
            ],
          );
          const callNoteId = noteResult[0].id;

          if (note.needs?.length > 0) {
            for (const need of note.needs) {
              await queryRunner.query(
                `INSERT INTO "call_note_need" ("mongo_oid", "name", "value", "call_id", "call_note_id") VALUES ($1, $2, $3, $4, $5)`,
                [need._id?.toString() ?? 'undefined-in-mongo', need.name, need.value, callId, callNoteId],
              );
            }
          }
        }
      }
    }

    const kindIDs = {};
    while (await companyCursor.hasNext()) {
      const company = await companyCursor.next();

      if (company.calls?.length) {
        for (const call of company.calls) {
          await runQuery(company, call, 'calls');
        }
      }

      if (company.salesCalls?.length) {
        for (const call of company.salesCalls) {
          await runQuery(company, call, 'salesCalls');
        }
      }

      if (company.insuranceSalesCalls?.length) {
        for (const call of company.insuranceSalesCalls) {
          await runQuery(company, call, 'insuranceSalesCalls');
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "call" WHERE "is_from_migration" IS TRUE`);
  }
}
