import { MigrationInterface, QueryRunner } from 'typeorm';

export class incidentReportReopenedStatusMigration1725438949733
  implements MigrationInterface
{
  name = 'incidentReportReopenedStatusMigration1725438949733';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."incident_reports_status_enum" RENAME TO "incident_reports_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."incident_reports_status_enum" AS ENUM('OPEN', 'CLOSED', 'REOPENED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ALTER COLUMN "status" TYPE "public"."incident_reports_status_enum" USING "status"::"text"::"public"."incident_reports_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ALTER COLUMN "status" SET DEFAULT 'OPEN'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."incident_reports_status_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."incident_reports_status_enum_old" AS ENUM('OPEN', 'CLOSED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ALTER COLUMN "status" TYPE "public"."incident_reports_status_enum_old" USING "status"::"text"::"public"."incident_reports_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ALTER COLUMN "status" SET DEFAULT 'OPEN'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."incident_reports_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."incident_reports_status_enum_old" RENAME TO "incident_reports_status_enum"`,
    );
  }
}
