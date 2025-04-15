import { MigrationInterface, QueryRunner } from 'typeorm';

export class incidentReportTeamMembersMigration1719968310859
  implements MigrationInterface
{
  name = 'incidentReportTeamMembersMigration.ts1719968310859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "incident_report_team_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "incident_report_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_abb673ad64e55e1befefa243864" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0dcd654744f4716e3fd0ff6867" ON "incident_report_team_members" ("incident_report_id", "user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_team_members" ADD CONSTRAINT "FK_27b17e5403a3989b89c1c48086d" FOREIGN KEY ("incident_report_id") REFERENCES "incident_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_team_members" ADD CONSTRAINT "FK_6887aed603e692e077a5b2bdfb6" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incident_report_team_members" DROP CONSTRAINT "FK_6887aed603e692e077a5b2bdfb6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_team_members" DROP CONSTRAINT "FK_27b17e5403a3989b89c1c48086d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP CONSTRAINT "FK_adb429810e37df76ecab9ba5563"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0dcd654744f4716e3fd0ff6867"`,
    );
    await queryRunner.query(`DROP TABLE "incident_report_team_members"`);
  }
}
