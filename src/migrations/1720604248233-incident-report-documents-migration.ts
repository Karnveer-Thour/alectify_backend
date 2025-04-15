import { MigrationInterface, QueryRunner } from 'typeorm';

export class incidentReportDocumentsMigration1720604248233
  implements MigrationInterface
{
  name = 'incidentReportDocumentsMigration1720604248233';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "incident_reports_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "file_name" character varying NOT NULL, "file_path" text NOT NULL, "file_type" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "soft_deleted_at" TIMESTAMP, "comment" character varying, "recovered_at" TIMESTAMP, "incident_report_id" uuid, "deleted_by" uuid, "recovered_by" uuid, "uploaded_by" uuid NOT NULL, CONSTRAINT "PK_891423e33d741000f8945ed49cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports_documents" ADD CONSTRAINT "FK_c2825bd456049f16fbd8e350f6b" FOREIGN KEY ("incident_report_id") REFERENCES "incident_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports_documents" ADD CONSTRAINT "FK_05fd2882987de3f3ab06bdbc3b0" FOREIGN KEY ("deleted_by") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports_documents" ADD CONSTRAINT "FK_2888ebd2efe02feee6444df1677" FOREIGN KEY ("recovered_by") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports_documents" ADD CONSTRAINT "FK_2965eb7492bcf8302a74016f889" FOREIGN KEY ("uploaded_by") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "incident_reports_documents"`);
    await queryRunner.query(
      `ALTER TABLE "incident_reports_documents" DROP CONSTRAINT "FK_2965eb7492bcf8302a74016f889"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports_documents" DROP CONSTRAINT "FK_2888ebd2efe02feee6444df1677"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports_documents" DROP CONSTRAINT "FK_05fd2882987de3f3ab06bdbc3b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_reports_documents" DROP CONSTRAINT "FK_c2825bd456049f16fbd8e350f6b"`,
    );
  }
}
