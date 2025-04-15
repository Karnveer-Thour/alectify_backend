import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAddFrequencyTypeMigration1708583554303
  implements MigrationInterface
{
  name = 'pmAddFrequencyTypeMigration1708583554303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_frequency_type_enum" AS ENUM('MONTHLY', 'WEEKLY', 'DAILY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "frequency_type" "public"."preventive_maintenances_frequency_type_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_frequency_type_enum" AS ENUM('MONTHLY', 'WEEKLY', 'DAILY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD "frequency_type" "public"."master_preventive_maintenances_frequency_type_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP COLUMN "frequency_type"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."master_preventive_maintenances_frequency_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "frequency_type"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_frequency_type_enum"`,
    );
  }
}
