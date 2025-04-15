import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsactiveInIncidentReportMigration1723531575582
  implements MigrationInterface
{
  name = 'addIsactiveInIncidentReportMigration1723531575582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "incident_reports" 
          ADD "is_active" boolean NOT NULL DEFAULT true
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "incident_reports" 
          DROP COLUMN "is_active"
        `);
  }
}
