import { MigrationInterface, QueryRunner } from 'typeorm';

export class documentsMigration1715802643450 implements MigrationInterface {
  name = 'documentsMigration1715802643450';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."documents_folder_enum" AS ENUM('PM Instructions', 'Commercial Docs', 'PM Reports', 'Images', 'Videos', 'Document Upload', 'Activity', 'Procedures', 'Submit For Review', 'Test Reports', 'Service Reports', 'Private', 'Others', 'Instruction Manual', 'Final Drawings', 'Electrical Packages', 'Addendums', 'Power Studies')`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "folder" "public"."documents_folder_enum" NOT NULL, "file_name" character varying NOT NULL, "file_path" text NOT NULL, "file_type" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "soft_deleted_at" TIMESTAMP, "comment" character varying, "recovered_at" TIMESTAMP, "project_id" uuid NOT NULL, "sub_project_id" uuid, "preventive_maintenance_id" uuid, "asset_id" uuid, "area_id" uuid, "created_by_id" uuid NOT NULL, "deleted_by" uuid, "recovered_by" uuid, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a2ea6f26f6e93a4b9fe8bce20b" ON "documents" ("project_id", "sub_project_id", "preventive_maintenance_id", "asset_id", "area_id", "created_by_id", "deleted_by", "recovered_by") `,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_e156b298c20873e14c362e789bf" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_ed0dd49f49aa6afc56d7c8064e3" FOREIGN KEY ("sub_project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_c914406684205d155a1d4ae73e9" FOREIGN KEY ("preventive_maintenance_id") REFERENCES "preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_7eef6f614e164f5733c42396573" FOREIGN KEY ("asset_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_f74fc3707c6d2911f3874eadc61" FOREIGN KEY ("area_id") REFERENCES "package_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_7f46f4f77acde1dcedba64cb220" FOREIGN KEY ("created_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_6e8f92451e0d2143f04daa161f7" FOREIGN KEY ("deleted_by") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_14dd383bd0ffdc899e3cdd150b9" FOREIGN KEY ("recovered_by") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_14dd383bd0ffdc899e3cdd150b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_6e8f92451e0d2143f04daa161f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_7f46f4f77acde1dcedba64cb220"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_f74fc3707c6d2911f3874eadc61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_7eef6f614e164f5733c42396573"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_c914406684205d155a1d4ae73e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_ed0dd49f49aa6afc56d7c8064e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_e156b298c20873e14c362e789bf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a2ea6f26f6e93a4b9fe8bce20b"`,
    );
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TYPE "public"."documents_folder_enum"`);
  }
}
