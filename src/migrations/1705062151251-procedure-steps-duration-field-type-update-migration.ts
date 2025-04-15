import { MigrationInterface, QueryRunner } from 'typeorm';

export class procedureStepsDurationFieldTypeUpdateMigration1705062151251
  implements MigrationInterface
{
  name = 'procedureStepsDurationFieldTypeUpdateMigration1705062151251';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" DROP COLUMN "duration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD "duration" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" DROP COLUMN "duration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure_steps" ADD "duration" integer`,
    );
  }
}
