import { MigrationInterface, QueryRunner } from 'typeorm';

export class v2_3_0__1601509875120 implements MigrationInterface {
  name = 'v2.3.0 1601509875120';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "call_kind" ("id" SERIAL NOT NULL, "kind" character varying(32) NOT NULL, "description" character varying, CONSTRAINT "PK_01c5127f2a21a75c847bf6135c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7cfdfdf67c0078769d2d9029f2" ON "call_kind" ("kind") `);
    await queryRunner.query(`CREATE INDEX "IDX_69cfcf3e765f77822539b03049" ON "call_kind" ("description") `);
    await queryRunner.query(
      `CREATE TABLE "call_note_need" ("id" SERIAL NOT NULL, "mongo_oid" character varying, "name" character varying NOT NULL, "value" character varying NOT NULL, "call_id" integer, "call_note_id" integer, CONSTRAINT "PK_58f2aaf0d0e5d25dd8b0e13a76c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_ee88cb1b740907d9c8c74b5995" ON "call_note_need" ("mongo_oid") `);
    await queryRunner.query(
      `CREATE TABLE "call_note" ("id" SERIAL NOT NULL, "mongo_oid" character varying, "user_mongo_oid" character varying, "pinned" boolean NOT NULL DEFAULT false, "text" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "call_id" integer, CONSTRAINT "PK_d0ab9596c0b793597608b604abd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_527db8ca873f5fc1c775f74f47" ON "call_note" ("mongo_oid") `);
    await queryRunner.query(`CREATE INDEX "IDX_75adc64d7a5b4c3246a7bb9754" ON "call_note" ("user_mongo_oid") `);
    await queryRunner.query(`CREATE INDEX "IDX_741012da7784a8f828b18a6c15" ON "call_note" ("created_at") `);
    await queryRunner.query(
      `CREATE TABLE "call" ("id" SERIAL NOT NULL, "is_from_migration" boolean NOT NULL DEFAULT 'false', "original_call_id" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_by_oid" character(24), "invitee_oid" character(24), "host_oid" character(24), "company_oid" character(24), "invitee_email" character varying, "calendly_id" character varying, "invitee_calendly_id" character varying, "call_scheduled_for" TIMESTAMP WITH TIME ZONE, "phone_number" character varying, "type" character varying NOT NULL, "disposition" character varying, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "deleted_at" TIMESTAMP WITH TIME ZONE, "status" character varying, "call_kind_id" integer, CONSTRAINT "CHK_6fd12acce2843314b858583c9b" CHECK (decode(created_by_oid::text, 'hex'::text) > '0'::bytea), CONSTRAINT "CHK_b0f2487f3a56d28f17f169b072" CHECK (decode(invitee_oid::text, 'hex'::text) > '0'::bytea), CONSTRAINT "CHK_ab3a23611b4b9c8fa2cfe649a4" CHECK (decode(host_oid::text, 'hex'::text) > '0'::bytea), CONSTRAINT "CHK_efe26c209e313c135369b6101d" CHECK (decode(company_oid::text, 'hex'::text) > '0'::bytea), CONSTRAINT "PK_2098af0169792a34f9cfdd39c47" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_b06c9b51d1172fba69e828673a" ON "call" ("created_at") `);
    await queryRunner.query(`CREATE INDEX "IDX_90ad606d92b2f87d3d9151d8ae" ON "call" ("company_oid") `);
    await queryRunner.query(`CREATE INDEX "IDX_71876ad4befac16b6f67aacece" ON "call" ("type") `);
    await queryRunner.query(
      `ALTER TABLE "call_note_need" ADD CONSTRAINT "FK_4fdb003340d8c540bbb24796866" FOREIGN KEY ("call_id") REFERENCES "call"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_note_need" ADD CONSTRAINT "FK_4ed12d38bb6e057c6a1e6d83024" FOREIGN KEY ("call_note_id") REFERENCES "call_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_note" ADD CONSTRAINT "FK_a381298143a1340b7073dd8c636" FOREIGN KEY ("call_id") REFERENCES "call"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "call" ADD CONSTRAINT "FK_87f2a9515725178266288b34772" FOREIGN KEY ("call_kind_id") REFERENCES "call_kind"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_87f2a9515725178266288b34772"`);
    await queryRunner.query(`ALTER TABLE "call_note" DROP CONSTRAINT "FK_a381298143a1340b7073dd8c636"`);
    await queryRunner.query(`ALTER TABLE "call_note_need" DROP CONSTRAINT "FK_4ed12d38bb6e057c6a1e6d83024"`);
    await queryRunner.query(`ALTER TABLE "call_note_need" DROP CONSTRAINT "FK_4fdb003340d8c540bbb24796866"`);
    await queryRunner.query(`DROP INDEX "IDX_71876ad4befac16b6f67aacece"`);
    await queryRunner.query(`DROP INDEX "IDX_90ad606d92b2f87d3d9151d8ae"`);
    await queryRunner.query(`DROP INDEX "IDX_b06c9b51d1172fba69e828673a"`);
    await queryRunner.query(`DROP TABLE "call"`);
    await queryRunner.query(`DROP INDEX "IDX_741012da7784a8f828b18a6c15"`);
    await queryRunner.query(`DROP INDEX "IDX_75adc64d7a5b4c3246a7bb9754"`);
    await queryRunner.query(`DROP INDEX "IDX_527db8ca873f5fc1c775f74f47"`);
    await queryRunner.query(`DROP TABLE "call_note"`);
    await queryRunner.query(`DROP INDEX "IDX_ee88cb1b740907d9c8c74b5995"`);
    await queryRunner.query(`DROP TABLE "call_note_need"`);
    await queryRunner.query(`DROP INDEX "IDX_69cfcf3e765f77822539b03049"`);
    await queryRunner.query(`DROP INDEX "IDX_7cfdfdf67c0078769d2d9029f2"`);
    await queryRunner.query(`DROP TABLE "call_kind"`);
  }
}
