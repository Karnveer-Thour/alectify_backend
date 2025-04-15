import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedPmInDrawHistoryMigration1715865481392
  implements MigrationInterface
{
  name = 'addedPmInDrawHistoryMigration1715865481392';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ADD "preventive_maintenance_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ADD CONSTRAINT "FK_e0c6996dc9dce12b95685975851" FOREIGN KEY ("preventive_maintenance_id") REFERENCES "preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" DROP COLUMN "preventive_maintenance_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" DROP CONSTRAINT "FK_e0c6996dc9dce12b95685975851"`,
    );
  }
}
