import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedCommentsColumnsPmDocsMigration1715072113671
  implements MigrationInterface
{
  name = 'addedCommentsColumnsPmDocsMigration1715072113671';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD "comment" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD "deleted_comment" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD "recovered_comment" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD "recovered_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD "recovered_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD CONSTRAINT "FK_c10b15d87fa256a3bc1aff3ce04" FOREIGN KEY ("recovered_by") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP COLUMN "recovered_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP COLUMN "recovered_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP COLUMN "recovered_comment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP COLUMN "deleted_comment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP COLUMN "comment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP CONSTRAINT "FK_c10b15d87fa256a3bc1aff3ce04"`,
    );
  }
}
