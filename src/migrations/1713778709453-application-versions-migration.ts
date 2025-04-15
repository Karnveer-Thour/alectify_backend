import { MigrationInterface, QueryRunner } from 'typeorm';

export class applicationVersionsMigration1713778709453
  implements MigrationInterface
{
  name = 'applicationVersionsMigration1713778709453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."application_versions_application_type_enum" AS ENUM('WEB', 'IOS', 'ANDROID')`,
    );
    await queryRunner.query(
      `CREATE TABLE "application_versions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" character varying NOT NULL, "is_force_update" boolean NOT NULL DEFAULT false, "application_type" "public"."application_versions_application_type_enum" NOT NULL, CONSTRAINT "PK_479a00a8a891ded7d81aa58eb04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d9375eb649a9270bd8dad123ec" ON "application_versions" ("application_type") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d9375eb649a9270bd8dad123ec"`,
    );
    await queryRunner.query(`DROP TABLE "application_versions"`);
    await queryRunner.query(
      `DROP TYPE "public"."application_versions_application_type_enum"`,
    );
  }
}
