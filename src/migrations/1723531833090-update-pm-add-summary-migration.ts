import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatePmAddSummaryMigration1723531833090
  implements MigrationInterface
{
  name = 'updatePmAddSummaryMigration1723531833090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "summary" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "summary"`,
    );
  }
}
