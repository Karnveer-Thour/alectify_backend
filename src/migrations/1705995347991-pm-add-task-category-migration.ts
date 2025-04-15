import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAddTaskCategoryMigration1705995347991
  implements MigrationInterface
{
  name = 'pmAddTaskCategoryMigration1705995347991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_task_category_enum" AS ENUM('CORRECTIVE_MAINTENANCE', 'CLEANUP', 'REPLACEMENT', 'OTHERS')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "task_category" "public"."preventive_maintenances_task_category_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "task_category"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_task_category_enum"`,
    );
  }
}
