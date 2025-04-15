import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmConvertIntoNumberEstimatedCostMigration1702012342776
  implements MigrationInterface
{
  name = 'pmConvertIntoNumberEstimatedCostMigration1702012342776';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "estimated_cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "estimated_cost" numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "estimated_cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "estimated_cost" character varying`,
    );
  }
}
