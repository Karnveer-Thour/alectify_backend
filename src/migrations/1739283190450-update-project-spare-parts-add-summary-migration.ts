import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateProjectSparePartsAddSummaryMigration1739283190450
  implements MigrationInterface
{
  name = 'updateProjectSparePartsAddSummaryMigration1739283190450';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" ADD "summary" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" DROP COLUMN "summary"`,
    );
  }
}
