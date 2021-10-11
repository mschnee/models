import { MigrationInterface, QueryRunner } from 'typeorm';

export class TcItemsUpdate1616784563744 implements MigrationInterface {
  name = 'TcItemsUpdate1616784563744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tc_cache_case" ADD "meta" jsonb DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "tc_item" ADD "owner_role" character varying DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "tc_item" ADD "assignee_role" character varying DEFAULT null`);
    await queryRunner.query(`COMMENT ON COLUMN "tc_cache_case"."created_at" IS NULL`);
    await queryRunner.query(`ALTER TABLE "tc_cache_case" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
    await queryRunner.query(`COMMENT ON COLUMN "tc_item_status"."created_at" IS NULL`);
    await queryRunner.query(`ALTER TABLE "tc_item_status" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
    await queryRunner.query(`COMMENT ON COLUMN "tc_item"."sfdc_task_id" IS NULL`);
    await queryRunner.query(`ALTER TABLE "tc_item" ALTER COLUMN "sfdc_task_id" SET DEFAULT null`);
    await queryRunner.query(`COMMENT ON COLUMN "tc_item"."sfdc_case_id" IS NULL`);
    await queryRunner.query(`ALTER TABLE "tc_item" ALTER COLUMN "sfdc_case_id" SET DEFAULT null`);
    await queryRunner.query(`COMMENT ON COLUMN "tc_item"."meta" IS NULL`);
    await queryRunner.query(`ALTER TABLE "tc_item" ALTER COLUMN "meta" SET DEFAULT null`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tc_item" ALTER COLUMN "meta" DROP DEFAULT`);
    await queryRunner.query(`COMMENT ON COLUMN "tc_item"."meta" IS NULL`);
    await queryRunner.query(`ALTER TABLE "tc_item" ALTER COLUMN "sfdc_case_id" SET DEFAULT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "tc_item"."sfdc_case_id" IS NULL`);
    await queryRunner.query(`ALTER TABLE "tc_item" ALTER COLUMN "sfdc_task_id" SET DEFAULT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "tc_item"."sfdc_task_id" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "tc_item_status" ALTER COLUMN "created_at" SET DEFAULT '2021-03-09 21:51:23.968737+00'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "tc_item_status"."created_at" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "tc_cache_case" ALTER COLUMN "created_at" SET DEFAULT '2021-03-09 21:51:23.968737+00'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "tc_cache_case"."created_at" IS NULL`);
    await queryRunner.query(`ALTER TABLE "tc_item" DROP COLUMN "assignee_role"`);
    await queryRunner.query(`ALTER TABLE "tc_item" DROP COLUMN "owner_role"`);
    await queryRunner.query(`ALTER TABLE "tc_cache_case" DROP COLUMN "meta"`);
  }
}
