import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterPmWorkTitleMigration1699653407966
  implements MigrationInterface
{
  name = 'masterPmWorkTitleMigration1699653407966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD "work_title" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD "created_by_id" uuid`,
    );

    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD CONSTRAINT "FK_c7621bfff3126166d8fc221ce0b" FOREIGN KEY ("created_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP CONSTRAINT "FK_c7621bfff3126166d8fc221ce0b"`,
    );

    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP COLUMN "created_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP COLUMN "work_title"`,
    );
  }
}
