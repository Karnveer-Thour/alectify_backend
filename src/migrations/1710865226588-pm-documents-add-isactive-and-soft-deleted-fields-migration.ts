import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmDocumentsAddIsactiveMigration1710865226588
  implements MigrationInterface
{
  name = 'pmDocumentsAddIsactiveAndSoftDeleteFieldsMigration1710865226588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD "soft_deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD "deleted_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD CONSTRAINT "FK_b24c3c0a5cbd3453c59558a87e3" FOREIGN KEY ("deleted_by") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP CONSTRAINT "FK_b24c3c0a5cbd3453c59558a87e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP COLUMN "deleted_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP COLUMN "soft_deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP COLUMN "is_active"`,
    );
  }
}
