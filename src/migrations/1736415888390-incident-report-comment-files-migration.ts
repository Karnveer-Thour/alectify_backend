import { MigrationInterface, QueryRunner } from 'typeorm';

export class incidentReportCommentFilesMigration1736415888390
  implements MigrationInterface
{
  name = 'incidentReportCommentFilesMigration1736415888390';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "incident_report_comment_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "file_name" character varying NOT NULL, "file_path" text NOT NULL, "file_type" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "incident_report_id" uuid NOT NULL, CONSTRAINT "PK_7feb97c4bed67930b0e0fa6c1e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_report_comment_files" ADD CONSTRAINT "FK_6e232fd0ee5863ac55ca8904a30" FOREIGN KEY ("incident_report_id") REFERENCES "incident_report_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incident_report_comment_files" DROP CONSTRAINT "FK_6e232fd0ee5863ac55ca8904a30"`,
    );
    await queryRunner.query(`DROP TABLE "incident_report_comment_files"`);
  }
}
