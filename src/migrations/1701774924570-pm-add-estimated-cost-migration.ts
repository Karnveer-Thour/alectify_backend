import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAddEstimatedCostMigration1701774924570
  implements MigrationInterface
{
  name = 'pmAddEstimatedCostMigration1701774924570';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "estimated_cost" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "estimated_cost"`,
    );
  }
}
