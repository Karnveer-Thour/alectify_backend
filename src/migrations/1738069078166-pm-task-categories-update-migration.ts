import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmTaskCategoriesUpdateMigration1738069078166
  implements MigrationInterface
{
  name = 'pmTaskCategoriesUpdateMigration1738069078166';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."preventive_maintenances_task_category_enum" RENAME TO "preventive_maintenances_task_category_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_task_category_enum" AS ENUM('CORRECTIVE_MAINTENANCE', 'CLEANUP', 'REPLACEMENT', 'OTHERS', 'PREVENTIVE_MAINTENANCE', 'DAMAGE', 'INSPECTION', 'SAFETY', 'TASK', 'DEFICIENCY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "task_category" TYPE "public"."preventive_maintenances_task_category_enum" USING "task_category"::"text"::"public"."preventive_maintenances_task_category_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_task_category_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."master_preventive_maintenances_task_category_enum" RENAME TO "master_preventive_maintenances_task_category_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_task_category_enum" AS ENUM('CORRECTIVE_MAINTENANCE', 'CLEANUP', 'REPLACEMENT', 'OTHERS', 'PREVENTIVE_MAINTENANCE', 'DAMAGE', 'INSPECTION', 'SAFETY', 'TASK', 'DEFICIENCY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ALTER COLUMN "task_category" TYPE "public"."master_preventive_maintenances_task_category_enum" USING "task_category"::"text"::"public"."master_preventive_maintenances_task_category_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."master_preventive_maintenances_task_category_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_task_category_enum_old" AS ENUM('CLEANUP', 'CORRECTIVE_MAINTENANCE', 'DAMAGE', 'INSPECTION', 'OTHERS', 'PREVENTIVE_MAINTENANCE', 'REPLACEMENT', 'SAFETY', 'TASK')`,
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
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_task_category_enum_old" AS ENUM('CLEANUP', 'CORRECTIVE_MAINTENANCE', 'DAMAGE', 'INSPECTION', 'OTHERS', 'PREVENTIVE_MAINTENANCE', 'REPLACEMENT', 'SAFETY', 'TASK')`,
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
  }
}
