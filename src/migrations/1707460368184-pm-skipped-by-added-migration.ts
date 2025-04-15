import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmSkippedByAddedMigration1707460368184
  implements MigrationInterface
{
  name = 'pmSkippedByAddedMigration1707460368184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "skipped_by_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_ac452bf513ba681d5d2bbd2b284" FOREIGN KEY ("skipped_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "skipped_by_id"`,
    );
  }
}
