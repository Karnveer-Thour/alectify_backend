import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedPriceInMangeOrderMigration1716121081735
  implements MigrationInterface
{
  name = 'addedPriceInMangeOrderMigration1716121081735';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ADD "price" numeric DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" DROP COLUMN "price"`,
    );
  }
}
