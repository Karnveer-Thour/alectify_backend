import { MigrationInterface, QueryRunner } from 'typeorm';

export class proceduresModule1702045117228 implements MigrationInterface {
  name = 'proceduresModule1702045117228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "procedure_steps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(150), "description" character varying(150) NOT NULL, "order_no" integer, "duration" integer, "comments" character varying(250), "completed_at" TIMESTAMP WITH TIME ZONE, "is_checked" boolean DEFAULT 'false', "image_url" character varying(255), "procedure_id" uuid, "completed_by_id" uuid, CONSTRAINT "PK_78ec04e53a1e71dd42b2cd452fd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procedure_library_steps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(150), "description" character varying(150) NOT NULL, "order_no" integer, "image_url" character varying(255), "procedure_library_id" uuid, CONSTRAINT "PK_f1159a41b0c9b4292720858d942" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."procedures_library_job_type_enum" AS ENUM('Job Plan', 'Standard Operating Procedure', 'Maintenance Operating Procedure')`,
    );
    await queryRunner.query(
      `CREATE TABLE "procedures_library" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "job_type" "public"."procedures_library_job_type_enum" NOT NULL, "name" character varying(150), "description" character varying(150) NOT NULL, "reference" character varying(150), "comments" boolean NOT NULL DEFAULT false, "file_upload" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_f4f0bcbb9dce3401aaaffcdc44f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."procedures_job_type_enum" AS ENUM('Job Plan', 'Standard Operating Procedure', 'Maintenance Operating Procedure')`,
    );
    await queryRunner.query(
      `CREATE TABLE "procedures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "job_type" "public"."procedures_job_type_enum" NOT NULL, "name" character varying(150), "description" character varying(150) NOT NULL, "reference" character varying(150), "comments" character varying, "file_upload" character varying, "procedure_library_id" uuid, CONSTRAINT "PK_e7775bab78f27b4c47580b6cb4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "procedure_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD "procedure_library_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD CONSTRAINT "FK_bd927e7767348c08a2f9ad62580" FOREIGN KEY ("procedure_id") REFERENCES "procedures"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD CONSTRAINT "FK_bd84af528f5afaf7fbff70e9184" FOREIGN KEY ("completed_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" ADD CONSTRAINT "FK_aade8c2f97a95224a2bd8074156" FOREIGN KEY ("procedure_library_id") REFERENCES "procedures_library"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD CONSTRAINT "FK_4f73fa85f200ee5e3ebd0e98158" FOREIGN KEY ("procedure_library_id") REFERENCES "procedures_library"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_459275bdecc2f1af02f8dd45f84" FOREIGN KEY ("procedure_id") REFERENCES "procedures"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD CONSTRAINT "FK_e3b9af362e6c3999f584d3b5fc9" FOREIGN KEY ("procedure_library_id") REFERENCES "procedures_library"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP CONSTRAINT "FK_e3b9af362e6c3999f584d3b5fc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_459275bdecc2f1af02f8dd45f84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" DROP CONSTRAINT "FK_4f73fa85f200ee5e3ebd0e98158"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" DROP CONSTRAINT "FK_aade8c2f97a95224a2bd8074156"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" DROP CONSTRAINT "FK_bd84af528f5afaf7fbff70e9184"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" DROP CONSTRAINT "FK_bd927e7767348c08a2f9ad62580"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP COLUMN "procedure_library_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "procedure_id"`,
    );
    await queryRunner.query(`DROP TABLE "procedures"`);
    await queryRunner.query(`DROP TYPE "public"."procedures_job_type_enum"`);
    await queryRunner.query(`DROP TABLE "procedures_library"`);
    await queryRunner.query(
      `DROP TYPE "public"."procedures_library_job_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "procedure_library_steps"`);
    await queryRunner.query(`DROP TABLE "procedure_steps"`);
  }
}
