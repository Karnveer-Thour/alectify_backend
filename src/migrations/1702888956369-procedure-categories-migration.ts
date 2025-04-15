import { MigrationInterface, QueryRunner } from 'typeorm';

export class procedureCategoriesMigration1702888956369
  implements MigrationInterface
{
  name = 'procedureCategoriesMigration1702888956369';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" ALTER COLUMN "description"  DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "procedure_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(150), CONSTRAINT "PK_f2646bbbca3abd888d6af645d5a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "procedures" ADD "category_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD "category_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD CONSTRAINT "FK_4f8bf48c837fedc07c18e0f194d" FOREIGN KEY ("category_id") REFERENCES "procedure_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD CONSTRAINT "FK_ee03375ac989d7492854ec4d2bf" FOREIGN KEY ("category_id") REFERENCES "procedure_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "procedure_categories"`);
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP COLUMN "category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" DROP COLUMN "category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP CONSTRAINT "FK_ee03375ac989d7492854ec4d2bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" DROP CONSTRAINT "FK_4f8bf48c837fedc07c18e0f194d"`,
    );
  }
}
