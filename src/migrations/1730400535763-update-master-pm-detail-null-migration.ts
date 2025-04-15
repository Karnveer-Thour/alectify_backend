import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateMasterPmDetailNullMigration1730400535763
  implements MigrationInterface
{
  name = 'updateMasterPmDetailNullMigration1730400535763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ALTER COLUMN "detail" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ALTER COLUMN "detail" SET NOT NULL`,
    );
  }
}
