import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsSummaryIsAdvisoryProjectSparePartsMigration1741806634203
  implements MigrationInterface
{
  name = 'addIsSummaryIsAdvisoryProjectSparePartsMigration1741806634203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" ADD "is_summary" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" ADD "is_advisory" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" DROP COLUMN "is_advisory"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" DROP COLUMN "is_summary"`,
    );
  }
}
