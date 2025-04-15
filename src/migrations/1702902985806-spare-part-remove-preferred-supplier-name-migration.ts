import { MigrationInterface, QueryRunner } from 'typeorm';

export class sparePartRemovePreferredSupplierNameMigration1702902985806
  implements MigrationInterface
{
  name = 'sparePartRemovePreferredSupplierNameMigration1702902985806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" DROP COLUMN "preferred_supplier_name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" ADD "preferred_supplier_name" character varying`,
    );
  }
}
