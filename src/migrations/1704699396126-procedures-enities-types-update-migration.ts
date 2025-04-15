import { MigrationInterface, QueryRunner } from 'typeorm';

export class proceduresEnitiesTypesUpdateMigration1704699396126
  implements MigrationInterface
{
  name = 'proceduresEnitiesTypesUpdateMigration1704699396126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" ADD "description" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" DROP COLUMN "image_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" ADD "image_url" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "procedure_steps" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" DROP COLUMN "comments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD "comments" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" DROP COLUMN "image_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD "image_url" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_categories" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_categories" ADD "name" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "procedures" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD "name" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "procedures" DROP COLUMN "reference"`);
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD "reference" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" DROP COLUMN "description"`,
    );
    await queryRunner.query(`ALTER TABLE "procedures" ADD "description" text`);
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP COLUMN "reference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD "reference" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD "description" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD "description" character varying(150) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP COLUMN "reference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD "reference" character varying(150)`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD "name" character varying(150)`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD "description" character varying(150) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "procedures" DROP COLUMN "reference"`);
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD "reference" character varying(150)`,
    );
    await queryRunner.query(`ALTER TABLE "procedures" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD "name" character varying(150)`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_categories" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_categories" ADD "name" character varying(150)`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" DROP COLUMN "image_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD "image_url" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" DROP COLUMN "comments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD "comments" character varying(250)`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD "description" character varying(150)`,
    );
    await queryRunner.query(`ALTER TABLE "procedure_steps" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD "name" character varying(150)`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" DROP COLUMN "image_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" ADD "image_url" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" ADD "description" character varying(150)`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_library_steps" ADD "name" character varying(150)`,
    );
  }
}
