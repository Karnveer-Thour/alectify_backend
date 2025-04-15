import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUnknownUserNameAndUpdateSystemStateIncidentReportCommentMigration1737025149116
  implements MigrationInterface
{
  name =
    'addUnknownUserNameAndUpdateSystemStateIncidentReportCommentMigration1737025149116';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incident_report_comments" ADD "unknown_user_name" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_comments" DROP COLUMN "system_state"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_comments" ADD "system_state" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incident_report_comments" DROP COLUMN "system_state"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_comments" ADD "system_state" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_comments" DROP COLUMN "unknown_user_name"`,
    );
  }
}
