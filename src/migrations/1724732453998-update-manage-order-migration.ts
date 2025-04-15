import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateManageOrderMigration1724732453998
  implements MigrationInterface
{
  name = 'updateManageOrderMigration1724732453998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_orders" ALTER COLUMN "ordered_date" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_orders" ALTER COLUMN "ordered_date" SET NOT NULL`,
    );
  }
}
