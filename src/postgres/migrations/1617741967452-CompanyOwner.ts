import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompanyOwner1617741967452 implements MigrationInterface {
  name = 'CompanyOwner1617741967452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_company_profile" ADD "roles" jsonb`);
    await queryRunner.query(`ALTER TABLE "company" ADD "owner_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "UQ_0c6ea8a32565efcb512e572d61d" UNIQUE ("owner_id")`,
    );
    await queryRunner.query(`ALTER TABLE "tc_item" ADD "sequence" double precision NOT NULL`);
    await queryRunner.query(`ALTER TABLE "call" ALTER COLUMN "is_from_migration" SET DEFAULT 'false'`);
    await queryRunner.query(`ALTER TABLE "call" ALTER COLUMN "updated_at" SET DEFAULT 'NOW()'`);
    await queryRunner.query(`ALTER TABLE "tc_cache_case" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
    await queryRunner.query(`ALTER TABLE "tc_item_status" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
    await queryRunner.query(`ALTER TABLE "tc_item" ALTER COLUMN "sfdc_task_id" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "tc_item" ALTER COLUMN "sfdc_case_id" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "tc_item" ALTER COLUMN "meta" SET DEFAULT '[]'`);
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "FK_0c6ea8a32565efcb512e572d61d" FOREIGN KEY ("owner_id") REFERENCES "user_company_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_0c6ea8a32565efcb512e572d61d"`);
    await queryRunner.query(`ALTER TABLE "tc_item" ALTER COLUMN "meta" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "tc_item" ALTER COLUMN "sfdc_case_id" SET DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "tc_item" ALTER COLUMN "sfdc_task_id" SET DEFAULT NULL`);
    await queryRunner.query(
      `ALTER TABLE "tc_item_status" ALTER COLUMN "created_at" SET DEFAULT '2021-04-02 19:09:29.072586+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tc_cache_case" ALTER COLUMN "created_at" SET DEFAULT '2021-04-02 19:09:29.072586+00'`,
    );
    await queryRunner.query(`ALTER TABLE "call" ALTER COLUMN "updated_at" SET DEFAULT '2021-03-29 19:39:14.850999+00'`);
    await queryRunner.query(`ALTER TABLE "call" ALTER COLUMN "is_from_migration" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "tc_item" DROP COLUMN "sequence"`);
    await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "UQ_0c6ea8a32565efcb512e572d61d"`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "user_company_profile" DROP COLUMN "roles"`);
  }
}
