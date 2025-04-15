import { MigrationInterface, QueryRunner } from 'typeorm';

export class procedureUpdateEnitityMigration1705313619762
  implements MigrationInterface
{
  name = 'procedureUpdateEnitityMigration1705313619762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "procedures" DROP COLUMN "comments"`);
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD "comments" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" DROP COLUMN "file_upload"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD "file_upload" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedures" DROP COLUMN "file_upload"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD "file_upload" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "procedures" DROP COLUMN "comments"`);
    await queryRunner.query(
      `ALTER TABLE "procedures" ADD "comments" character varying`,
    );
  }
}
