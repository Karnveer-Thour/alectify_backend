import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedPmImageColumn1710951770012 implements MigrationInterface {
  name = 'addedPmImageColumn1710951770012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "image_url" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD "image_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP COLUMN "image_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "image_url"`,
    );
  }
}
