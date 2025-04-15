import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedPoNumberInOrderMigration1716897327241
  implements MigrationInterface
{
  name = 'addedPoNumberInOrderMigration1716897327241';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_orders" ADD "unit_price" numeric DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_orders" ADD "po_number" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_orders" DROP COLUMN "po_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_orders" DROP COLUMN "unit_price"`,
    );
  }
}
