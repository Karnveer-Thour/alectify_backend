import { MigrationInterface, QueryRunner } from 'typeorm';

export class procedureAddImageUrlMigration1705324512371
  implements MigrationInterface
{
  name = 'procedureAddImageUrlMigration1705324512371';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD "image_url" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD "image_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP COLUMN "image_url"`,
    );
    await queryRunner.query(`ALTER TABLE "procedures" DROP COLUMN "image_url"`);
  }
}
