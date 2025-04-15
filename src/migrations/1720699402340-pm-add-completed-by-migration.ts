import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAddCompletedByMigration1720699402340
  implements MigrationInterface
{
  name = 'pmAddCompletedByMigration1720699402340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "closed_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "completion_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "completed_by_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_1c4550458b07edb213048f6ad44" FOREIGN KEY ("completed_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_1c4550458b07edb213048f6ad44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "completed_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "completion_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "closed_at" TIMESTAMP`,
    );
  }
}
