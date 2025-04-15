import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAddIsGenericMigration1706529734441
  implements MigrationInterface
{
  name = 'pmAddIsGenericMigration1706529734441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD "is_generic" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "is_generic" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "is_generic"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP COLUMN "is_generic"`,
    );
  }
}
