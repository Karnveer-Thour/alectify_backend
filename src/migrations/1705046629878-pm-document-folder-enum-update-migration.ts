import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmDocumentFolderEnumUpdateMigration1705046629878
  implements MigrationInterface
{
  name = 'pmDocumentFolderEnumUpdateMigration1705046629878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."preventive_maintenance_documents_folder_enum" RENAME TO "preventive_maintenance_documents_folder_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenance_documents_folder_enum" AS ENUM('PM_INSTRUCTIONS', 'COMMERCIAL_DOCS', 'PM_REPORTS', 'IMAGES', 'VIDEOS', 'DOCUMENT_UPLOAD', 'ACTIVITY', 'PROCEDURES', 'SUBMIT_FOR_REVIEW')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ALTER COLUMN "folder" TYPE "public"."preventive_maintenance_documents_folder_enum" USING "folder"::"text"::"public"."preventive_maintenance_documents_folder_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenance_documents_folder_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenance_documents_folder_enum_old" AS ENUM('PM_INSTRUCTIONS', 'COMMERCIAL_DOCS', 'PM_REPORTS', 'IMAGES', 'VIDEOS')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ALTER COLUMN "folder" TYPE "public"."preventive_maintenance_documents_folder_enum_old" USING "folder"::"text"::"public"."preventive_maintenance_documents_folder_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenance_documents_folder_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."preventive_maintenance_documents_folder_enum_old" RENAME TO "preventive_maintenance_documents_folder_enum"`,
    );
  }
}
