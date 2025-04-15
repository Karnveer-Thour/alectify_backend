import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMasterPmDocumentsMigration1741277981865
  implements MigrationInterface
{
  name = 'addMasterPmDocumentsMigration1741277981865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "master_preventive_maintenance_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "file_name" character varying NOT NULL, "file_path" text NOT NULL, "file_type" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "soft_deleted_at" TIMESTAMP, "master_preventive_maintenance_id" uuid NOT NULL, "user_id" uuid NOT NULL, "deleted_by" uuid, CONSTRAINT "PK_247a72810e3d03dcf6a50f4fc16" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "master_preventive_maintenance_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "file_name" character varying NOT NULL, "file_path" text NOT NULL, "file_type" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "soft_deleted_at" TIMESTAMP, "master_preventive_maintenance_id" uuid NOT NULL, "user_id" uuid NOT NULL, "deleted_by" uuid, CONSTRAINT "PK_f3b9c9b4987deac77879470cb88" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_files" ADD CONSTRAINT "FK_f0c4786a32a2d8b8ea98099877f" FOREIGN KEY ("master_preventive_maintenance_id") REFERENCES "master_preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_files" ADD CONSTRAINT "FK_3e3aa1b65b083487691b6d311c0" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_files" ADD CONSTRAINT "FK_129a08e81e4551a03e6b9968e1f" FOREIGN KEY ("deleted_by") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_images" ADD CONSTRAINT "FK_f82ca89896beb05de7816f6c1cd" FOREIGN KEY ("master_preventive_maintenance_id") REFERENCES "master_preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_images" ADD CONSTRAINT "FK_51b326a9fa8b9a4325d56add6db" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_images" ADD CONSTRAINT "FK_c4c8c50eec15f94c8667eabc3dd" FOREIGN KEY ("deleted_by") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_images" DROP CONSTRAINT "FK_c4c8c50eec15f94c8667eabc3dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_images" DROP CONSTRAINT "FK_51b326a9fa8b9a4325d56add6db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_images" DROP CONSTRAINT "FK_f82ca89896beb05de7816f6c1cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_files" DROP CONSTRAINT "FK_129a08e81e4551a03e6b9968e1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_files" DROP CONSTRAINT "FK_3e3aa1b65b083487691b6d311c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_files" DROP CONSTRAINT "FK_f0c4786a32a2d8b8ea98099877f"`,
    );
    await queryRunner.query(
      `DROP TABLE "master_preventive_maintenance_images"`,
    );
    await queryRunner.query(`DROP TABLE "master_preventive_maintenance_files"`);
  }
}
