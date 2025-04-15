import { MigrationInterface, QueryRunner } from 'typeorm';

export class nulltableEstDateMigration1716471237324
  implements MigrationInterface
{
  name = 'nulltableEstDateMigration1716471237324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_orders" ALTER COLUMN "estimated_date" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_orders" ALTER COLUMN "estimated_date" SET NOT NULL`,
    );
  }
}
