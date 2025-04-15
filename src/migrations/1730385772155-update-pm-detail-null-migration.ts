import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatePmDetailNullMigration1730385772155
  implements MigrationInterface
{
  name = 'updatePmDetailNullMigration1730385772155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "detail" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "detail" SET NOT NULL`,
    );
  }
}
