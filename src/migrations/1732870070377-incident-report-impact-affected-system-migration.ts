import { MigrationInterface, QueryRunner } from 'typeorm';

export class incidentReportImpactAffectedSystemMigrations1732870070377
  implements MigrationInterface
{
  name = 'incidentReportImpactAffectedSystemMigrations1732870070377';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "incident_report_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "description" text NOT NULL, "actions" text, "system_state" character varying(255), "call_at" TIMESTAMP, "next_update_at" TIMESTAMP, "incident_summary" text, "is_system_generated" boolean NOT NULL DEFAULT true, "incident_report_id" uuid NOT NULL, "created_by_id" uuid, CONSTRAINT "PK_4fd568228f504890dc996fc909a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c0798628104e3bc0e2c91d9331" ON "incident_report_comments" ("incident_report_id", "created_by_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "incident_report_areas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "incident_report_id" uuid NOT NULL, "area_id" uuid NOT NULL, CONSTRAINT "PK_8e664e3feb2de919f438f6f0f8d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f15b729fef36524cd49de2da01" ON "incident_report_areas" ("incident_report_id", "area_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "incident_report_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "incident_report_id" uuid NOT NULL, "asset_id" uuid NOT NULL, CONSTRAINT "PK_fcc07e254e508cd64a1d0a3ac9c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5569ccebb9004c74e211ed0203" ON "incident_report_assets" ("incident_report_id", "asset_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "incident_impacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "project_id" uuid NOT NULL, CONSTRAINT "PK_53cf02aeba832982ca8e30b2db5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8c23d77bd4dbba3da7688407c3" ON "incident_impacts" ("project_id", "name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "affected_systems" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "project_id" uuid NOT NULL, CONSTRAINT "PK_5649f199371c371293192b06578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e88da42c0fd8f79da07cce4dfa" ON "affected_systems" ("project_id", "name") `,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD "incident_no" character varying(255)`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."incident_reports_type_enum" AS ENUM('Utility Event', 'Incident')`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD "type" "public"."incident_reports_type_enum" NOT NULL DEFAULT 'Incident'`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD "email_to_client" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD "sub_project_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD "affected_system_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD "impact_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_comments" ADD CONSTRAINT "FK_15d0f979c039a9c9ab0f550ba2a" FOREIGN KEY ("incident_report_id") REFERENCES "incident_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_comments" ADD CONSTRAINT "FK_9ad70e365411d55fd13a929d459" FOREIGN KEY ("created_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_areas" ADD CONSTRAINT "FK_351d56efaeeb655bbad5c2516e8" FOREIGN KEY ("incident_report_id") REFERENCES "incident_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_areas" ADD CONSTRAINT "FK_fd764da5907f1f97b85b26451db" FOREIGN KEY ("area_id") REFERENCES "package_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_assets" ADD CONSTRAINT "FK_ed7db48b771c0cb8c47cae2634b" FOREIGN KEY ("incident_report_id") REFERENCES "incident_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_assets" ADD CONSTRAINT "FK_932e9cedbe2081bd3af25cf3646" FOREIGN KEY ("asset_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_impacts" ADD CONSTRAINT "FK_dc7c48a3e4595f0ec74150b3233" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD CONSTRAINT "FK_9f2452771b68daee09b1417979e" FOREIGN KEY ("sub_project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD CONSTRAINT "FK_569c46b8d2ae8f08e4968998ed5" FOREIGN KEY ("affected_system_id") REFERENCES "affected_systems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" ADD CONSTRAINT "FK_2ab95e4540acdda689bd114a05f" FOREIGN KEY ("impact_id") REFERENCES "incident_impacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "affected_systems" ADD CONSTRAINT "FK_f418e8f18ed15c3d8c9a91ae348" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "affected_systems" DROP CONSTRAINT "FK_f418e8f18ed15c3d8c9a91ae348"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP CONSTRAINT "FK_2ab95e4540acdda689bd114a05f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP CONSTRAINT "FK_569c46b8d2ae8f08e4968998ed5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP CONSTRAINT "FK_9f2452771b68daee09b1417979e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_impacts" DROP CONSTRAINT "FK_dc7c48a3e4595f0ec74150b3233"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_assets" DROP CONSTRAINT "FK_932e9cedbe2081bd3af25cf3646"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_assets" DROP CONSTRAINT "FK_ed7db48b771c0cb8c47cae2634b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_areas" DROP CONSTRAINT "FK_fd764da5907f1f97b85b26451db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_areas" DROP CONSTRAINT "FK_351d56efaeeb655bbad5c2516e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_comments" DROP CONSTRAINT "FK_9ad70e365411d55fd13a929d459"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_comments" DROP CONSTRAINT "FK_15d0f979c039a9c9ab0f550ba2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP COLUMN "impact_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP COLUMN "affected_system_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP COLUMN "sub_project_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP COLUMN "email_to_client"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP COLUMN "type"`,
    );
    await queryRunner.query(`DROP TYPE "public"."incident_reports_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "incident_reports" DROP COLUMN "incident_no"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e88da42c0fd8f79da07cce4dfa"`,
    );
    await queryRunner.query(`DROP TABLE "affected_systems"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8c23d77bd4dbba3da7688407c3"`,
    );
    await queryRunner.query(`DROP TABLE "incident_impacts"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5569ccebb9004c74e211ed0203"`,
    );
    await queryRunner.query(`DROP TABLE "incident_report_assets"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f15b729fef36524cd49de2da01"`,
    );
    await queryRunner.query(`DROP TABLE "incident_report_areas"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c0798628104e3bc0e2c91d9331"`,
    );
    await queryRunner.query(`DROP TABLE "incident_report_comments"`);
  }
}
