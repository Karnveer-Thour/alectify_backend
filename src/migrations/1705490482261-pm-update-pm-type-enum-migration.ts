import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmUpdatePmTypeEnumMigration1705490482261
  implements MigrationInterface
{
  name = 'pmUpdatePmTypeEnumMigration1705490482261';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."master_preventive_maintenances_pm_type_enum" RENAME TO "master_preventive_maintenances_pm_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_pm_type_enum" AS ENUM('PM_INTERNAL', 'PM_EXTERNAL', 'TASK')`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ALTER COLUMN "pm_type" TYPE "public"."master_preventive_maintenances_pm_type_enum" USING "pm_type"::"text"::"public"."master_preventive_maintenances_pm_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."master_preventive_maintenances_pm_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."preventive_maintenances_pm_type_enum" RENAME TO "preventive_maintenances_pm_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_pm_type_enum" AS ENUM('PM_INTERNAL', 'PM_EXTERNAL', 'TASK')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "pm_type" TYPE "public"."preventive_maintenances_pm_type_enum" USING "pm_type"::"text"::"public"."preventive_maintenances_pm_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_pm_type_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_pm_type_enum_old" AS ENUM('PM_INTERNAL', 'PM_EXTERNAL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "pm_type" TYPE "public"."preventive_maintenances_pm_type_enum_old" USING "pm_type"::"text"::"public"."preventive_maintenances_pm_type_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_pm_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."preventive_maintenances_pm_type_enum_old" RENAME TO "preventive_maintenances_pm_type_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_pm_type_enum_old" AS ENUM('PM_INTERNAL', 'PM_EXTERNAL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ALTER COLUMN "pm_type" TYPE "public"."master_preventive_maintenances_pm_type_enum_old" USING "pm_type"::"text"::"public"."master_preventive_maintenances_pm_type_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."master_preventive_maintenances_pm_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."master_preventive_maintenances_pm_type_enum_old" RENAME TO "master_preventive_maintenances_pm_type_enum"`,
    );
  }
}
