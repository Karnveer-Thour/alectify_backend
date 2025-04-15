import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTaskCategoryEnumMigration1713164353304
  implements MigrationInterface
{
  name = 'updateTaskCategoryEnumMigration1713164353304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."master_preventive_maintenances_task_category_enum" RENAME TO "master_preventive_maintenances_task_category_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_task_category_enum" AS ENUM('CORRECTIVE_MAINTENANCE', 'CLEANUP', 'REPLACEMENT', 'OTHERS', 'PREVENTIVE_MAINTENANCE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ALTER COLUMN "task_category" TYPE "public"."master_preventive_maintenances_task_category_enum" USING "task_category"::"text"::"public"."master_preventive_maintenances_task_category_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."master_preventive_maintenances_task_category_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."preventive_maintenances_task_category_enum" RENAME TO "preventive_maintenances_task_category_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_task_category_enum" AS ENUM('CORRECTIVE_MAINTENANCE', 'CLEANUP', 'REPLACEMENT', 'OTHERS', 'PREVENTIVE_MAINTENANCE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "task_category" TYPE "public"."preventive_maintenances_task_category_enum" USING "task_category"::"text"::"public"."preventive_maintenances_task_category_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_task_category_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_task_category_enum_old" AS ENUM('CORRECTIVE_MAINTENANCE', 'CLEANUP', 'REPLACEMENT', 'OTHERS')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "task_category" TYPE "public"."preventive_maintenances_task_category_enum_old" USING "task_category"::"text"::"public"."preventive_maintenances_task_category_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_task_category_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."preventive_maintenances_task_category_enum_old" RENAME TO "preventive_maintenances_task_category_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_task_category_enum_old" AS ENUM('CORRECTIVE_MAINTENANCE', 'CLEANUP', 'REPLACEMENT', 'OTHERS')`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ALTER COLUMN "task_category" TYPE "public"."master_preventive_maintenances_task_category_enum_old" USING "task_category"::"text"::"public"."master_preventive_maintenances_task_category_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."master_preventive_maintenances_task_category_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."master_preventive_maintenances_task_category_enum_old" RENAME TO "master_preventive_maintenances_task_category_enum"`,
    );
  }
}
