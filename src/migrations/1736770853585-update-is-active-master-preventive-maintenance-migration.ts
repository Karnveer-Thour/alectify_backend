import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateIsActiveMasterPreventiveMaintenanceMigration1736770853585
  implements MigrationInterface
{
  name = 'updateIsActiveMasterPreventiveMaintenanceMigration1736770853585';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP COLUMN "is_active"`,
    );
  }
}
