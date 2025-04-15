import { MigrationInterface, QueryRunner } from 'typeorm';

export class IncidentReportsMigration1718659926186
  implements MigrationInterface
{
  name = 'IncidentReportsMigration1718659926186';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."incident_reports_priority_enum" AS ENUM('NORMAL', 'CRITICAL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "incident_reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "incident_id" character varying NOT NULL, "title" character varying(255) NOT NULL, "description" text NOT NULL, "priority" "public"."incident_reports_priority_enum", "project_id" uuid NOT NULL, "team_id" uuid, "created_by_id" uuid, CONSTRAINT "PK_8b924dea33e3dd1ef1bbac02ad6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd044b7e2100e0fad1a533c4e5" ON "incident_reports" ("project_id", "team_id", "created_by_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD CONSTRAINT "FK_a21a9ab29e1d2988559be86f2c7" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD CONSTRAINT "FK_34e7fb9b1d741103ff62ff60d20" FOREIGN KEY ("created_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP CONSTRAINT "FK_34e7fb9b1d741103ff62ff60d20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP CONSTRAINT "FK_a21a9ab29e1d2988559be86f2c7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd044b7e2100e0fad1a533c4e5"`,
    );
    await queryRunner.query(`DROP TABLE "incident_reports"`);
    await queryRunner.query(
      `DROP TYPE "public"."incident_reports_priority_enum"`,
    );
  }
}
