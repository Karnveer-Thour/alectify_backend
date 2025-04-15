import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAddIsReopenedMigration1711677993857
  implements MigrationInterface
{
  name = 'pmAddIsReopenedMigration1711677993857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "is_reopened" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "is_reopened"`,
    );
  }
}
