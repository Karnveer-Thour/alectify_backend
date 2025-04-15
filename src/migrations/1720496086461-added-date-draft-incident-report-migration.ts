import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedDateDraftIncidentReportMigration1720496086461
  implements MigrationInterface
{
  name = 'addedDateDraftIncidentReportMigration1720496086461';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD "incident_date" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD "is_draft" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP COLUMN "is_draft"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP COLUMN "incident_date"`,
    );
  }
}
