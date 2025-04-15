import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAddPriorityMigration1708352165116 implements MigrationInterface {
  name = 'pmAddPriorityMigration1708352165116';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_priority_enum" AS ENUM('NORMAL', 'CRITICAL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD "priority" "public"."master_preventive_maintenances_priority_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_priority_enum" AS ENUM('NORMAL', 'CRITICAL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "priority" "public"."preventive_maintenances_priority_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "priority"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_priority_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP COLUMN "priority"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."master_preventive_maintenances_priority_enum"`,
    );
  }
}
