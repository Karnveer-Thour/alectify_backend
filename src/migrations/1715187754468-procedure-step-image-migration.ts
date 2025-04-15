import { MigrationInterface, QueryRunner } from 'typeorm';

export class procedureStepImageMigration1715187754468
  implements MigrationInterface
{
  name = 'procedureStepImageMigration1715187754468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD "default_image_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" DROP COLUMN "default_image_url"`,
    );
  }
}
