import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmMasterAddTaskCategoryMigration1705996039562
  implements MigrationInterface
{
  name = 'pmMasterAddTaskCategoryMigration1705996039562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_task_category_enum" AS ENUM('CORRECTIVE_MAINTENANCE', 'CLEANUP', 'REPLACEMENT', 'OTHERS')`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD "task_category" "public"."master_preventive_maintenances_task_category_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP COLUMN "task_category"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."master_preventive_maintenances_task_category_enum"`,
    );
  }
}
