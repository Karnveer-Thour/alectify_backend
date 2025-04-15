import { MigrationInterface, QueryRunner } from 'typeorm';

export class addStatusToIncidentReportMigration1723467635268
  implements MigrationInterface
{
  name = 'addStatusToIncidentReportMigration1723467635268';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."incident_reports_status_enum" AS ENUM('OPEN', 'CLOSED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD "status" "public"."incident_reports_status_enum" DEFAULT 'OPEN'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."incident_reports_status_enum"`,
    );
  }
}
