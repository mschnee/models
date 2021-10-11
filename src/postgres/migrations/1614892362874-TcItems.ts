import { MigrationInterface, QueryRunner } from 'typeorm';

export class TcItems1614892362874 implements MigrationInterface {
  name = 'TcItems1614892362874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_company_profile" ("id" SERIAL NOT NULL, "mng_user_id" character(24) NOT NULL, "company_id" integer, CONSTRAINT "CHK_51f09f8d3efbf4cab9db731a5e" CHECK (decode(mng_user_id::text, 'hex'::text) > '0'::bytea), CONSTRAINT "PK_03e37206fd9f2c1d3d943e96157" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bc3244474b4501984a9bc1a14b" ON "user_company_profile" ("mng_user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("id" SERIAL NOT NULL, "mng_company_id" character(24) NOT NULL, CONSTRAINT "CHK_a44ce5750dddae32d31e9283cd" CHECK (decode(mng_company_id::text, 'hex'::text) > '0'::bytea), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c9a313da7ba510313550f14f1e" ON "company" ("mng_company_id") `);
    await queryRunner.query(
      `CREATE TABLE "tc_cache_case" ("id" SERIAL NOT NULL, "sfdc_case_id" character(18) NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', CONSTRAINT "PK_6b9d1d093fc2f0b88d79e8f8aab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f1ee29a8904491cc9f99d5830a" ON "tc_cache_case" ("sfdc_case_id") `);
    await queryRunner.query(
      `CREATE TABLE "tc_item_status" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "tc_item_id" integer, "createdById" integer, CONSTRAINT "PK_b7829008d768920d876c25ce40a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tc_item" ("id" SERIAL NOT NULL, "sfdc_task_id" character(18) DEFAULT null, "sfdc_case_id" character(18) DEFAULT null, "type" character(255) NOT NULL, "meta" jsonb DEFAULT null, "actions" jsonb NOT NULL, "company_id" integer, "owner_id" integer, "assignee_id" integer, CONSTRAINT "PK_bf6414de39db990eb1342b86db3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_4e2181fdd5c76e1e750d46d66a" ON "tc_item" ("sfdc_task_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_6ae2c7ee6dd4410128d9dc8a7f" ON "tc_item" ("sfdc_case_id") `);
    await queryRunner.query(
      `ALTER TABLE "user_company_profile" ADD CONSTRAINT "FK_6fe7932ea5a7ff20b5eeaa5dc32" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tc_item_status" ADD CONSTRAINT "FK_7382fc8c3e978b5c8051d31610f" FOREIGN KEY ("tc_item_id") REFERENCES "tc_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tc_item_status" ADD CONSTRAINT "FK_e67f37c4564a5d4fdbbf173f516" FOREIGN KEY ("createdById") REFERENCES "user_company_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tc_item" ADD CONSTRAINT "FK_28d28e8d5c49b1eb11ddadcfcdd" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tc_item" ADD CONSTRAINT "FK_33252419cd81b2887bd14b1c123" FOREIGN KEY ("owner_id") REFERENCES "user_company_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tc_item" ADD CONSTRAINT "FK_767b2e1c988ce4d9719459df6ee" FOREIGN KEY ("assignee_id") REFERENCES "user_company_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tc_item" DROP CONSTRAINT "FK_767b2e1c988ce4d9719459df6ee"`);
    await queryRunner.query(`ALTER TABLE "tc_item" DROP CONSTRAINT "FK_33252419cd81b2887bd14b1c123"`);
    await queryRunner.query(`ALTER TABLE "tc_item" DROP CONSTRAINT "FK_28d28e8d5c49b1eb11ddadcfcdd"`);
    await queryRunner.query(`ALTER TABLE "tc_item_status" DROP CONSTRAINT "FK_e67f37c4564a5d4fdbbf173f516"`);
    await queryRunner.query(`ALTER TABLE "tc_item_status" DROP CONSTRAINT "FK_7382fc8c3e978b5c8051d31610f"`);
    await queryRunner.query(`ALTER TABLE "user_company_profile" DROP CONSTRAINT "FK_6fe7932ea5a7ff20b5eeaa5dc32"`);
    await queryRunner.query(`DROP INDEX "IDX_6ae2c7ee6dd4410128d9dc8a7f"`);
    await queryRunner.query(`DROP INDEX "IDX_4e2181fdd5c76e1e750d46d66a"`);
    await queryRunner.query(`DROP TABLE "tc_item"`);
    await queryRunner.query(`DROP TABLE "tc_item_status"`);
    await queryRunner.query(`DROP INDEX "IDX_f1ee29a8904491cc9f99d5830a"`);
    await queryRunner.query(`DROP TABLE "tc_cache_case"`);
    await queryRunner.query(`DROP INDEX "IDX_c9a313da7ba510313550f14f1e"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP INDEX "IDX_bc3244474b4501984a9bc1a14b"`);
    await queryRunner.query(`DROP TABLE "user_company_profile"`);
  }
}
