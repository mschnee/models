import { MigrationInterface, QueryRunner } from 'typeorm';

export class CaseCompany1618953574001 implements MigrationInterface {
  name = 'CaseCompany1618953574001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tc_cache_case" ADD "company_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "tc_cache_case" ADD CONSTRAINT "FK_2df1cd6b19146b5523f3ceaac6e" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tc_cache_case" DROP CONSTRAINT "FK_2df1cd6b19146b5523f3ceaac6e"`);
    await queryRunner.query(`ALTER TABLE "tc_cache_case" DROP COLUMN "company_id"`);
  }
}
