import { MigrationInterface, QueryRunner } from 'typeorm';

export class addProjectIdProcedureMigration1724044645255
  implements MigrationInterface
{
  name = 'addProjectIdProcedureMigration1724044645255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedures" RENAME COLUMN "category_id" TO "project_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" DROP CONSTRAINT "FK_4f8bf48c837fedc07c18e0f194d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD "project_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD CONSTRAINT "FK_c6efd0202c6d35fac8c246b2b45" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD CONSTRAINT "FK_be38dec8a5e7ae138b56c41516f" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedures" DROP CONSTRAINT "FK_be38dec8a5e7ae138b56c41516f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP CONSTRAINT "FK_c6efd0202c6d35fac8c246b2b45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP COLUMN "project_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD CONSTRAINT "FK_4f8bf48c837fedc07c18e0f194d" FOREIGN KEY ("project_id") REFERENCES "procedure_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" RENAME COLUMN "project_id" TO "category_id"`,
    );
  }
}
