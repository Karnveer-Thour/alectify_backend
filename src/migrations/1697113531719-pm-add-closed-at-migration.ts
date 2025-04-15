import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAddClosedAtMigration1697113531719 implements MigrationInterface {
  name = 'pmAddClosedAtMigration1697113531719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "closed_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "closed_at"`,
    );
  }
}
