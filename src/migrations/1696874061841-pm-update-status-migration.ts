import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmUpdateStatusMigration1696874061841
  implements MigrationInterface
{
  name = 'pmUpdateStatusMigration1696874061841';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."preventive_maintenances_status_enum" RENAME TO "preventive_maintenances_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_status_enum" AS ENUM('PENDING', 'WAITING FOR REVIEW', 'COMPLETED', 'SKIPPED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "status" TYPE "public"."preventive_maintenances_status_enum" USING "status"::"text"::"public"."preventive_maintenances_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_status_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_status_enum_old" AS ENUM('PENDING', 'COMPLETED', 'SKIPPED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "status" TYPE "public"."preventive_maintenances_status_enum_old" USING "status"::"text"::"public"."preventive_maintenances_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."preventive_maintenances_status_enum_old" RENAME TO "preventive_maintenances_status_enum"`,
    );
  }
}
