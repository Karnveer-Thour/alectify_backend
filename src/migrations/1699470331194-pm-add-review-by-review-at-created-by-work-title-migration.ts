import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAddReviewByReviewAtCreatedByWorkTitleMigration1699470331194
  implements MigrationInterface
{
  name = 'pmAddReviewByReviewAtWorkTitleMigration1699470331194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "work_title" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "reviewed_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "estimated_hours" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "reviewed_by_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "created_by_id" uuid`,
    );

    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_be32129d465e5f636fb0af85f71" FOREIGN KEY ("reviewed_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_2a19d8be1a692e13c65b36ffe69" FOREIGN KEY ("created_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_2a19d8be1a692e13c65b36ffe69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_be32129d465e5f636fb0af85f71"`,
    );

    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "created_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "reviewed_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "estimated_hours"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "reviewed_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "work_title"`,
    );
  }
}
