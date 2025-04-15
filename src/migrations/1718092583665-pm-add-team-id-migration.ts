import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAddTeamIdMigration1718092583665 implements MigrationInterface {
  name = 'pmAddTeamIdMigration1718092583665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db46e4be81f86a584b16f2940b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_212cfdf230b3224d2b3e3aeaf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD "team_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "team_id" uuid`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cdea3a95e74f9c5e98ae6fc369" ON "master_preventive_maintenances" ("project_id", "sub_project_id", "preferred_supplier_id", "area_id", "asset_id", "pm_type", "procedure_library_id", "due_date", "created_by_id", "team_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_02a11d8b32755edd4042bc5a94" ON "preventive_maintenances" ("project_id", "sub_project_id", "master_preventive_maintenance_id", "preferred_supplier_id", "area_id", "asset_id", "pm_type", "status", "is_future", "due_date", "created_by_id", "team_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD CONSTRAINT "FK_ecd314aeaeb93f23816367d84dd" FOREIGN KEY ("team_id") REFERENCES "projects_masterprojectteam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_f1a2d9e1cb38dd45dbf2e1f5b6d" FOREIGN KEY ("team_id") REFERENCES "projects_masterprojectteam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_f1a2d9e1cb38dd45dbf2e1f5b6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP CONSTRAINT "FK_ecd314aeaeb93f23816367d84dd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_02a11d8b32755edd4042bc5a94"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cdea3a95e74f9c5e98ae6fc369"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "team_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP COLUMN "team_id"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_212cfdf230b3224d2b3e3aeaf7" ON "preventive_maintenances" ("pm_type", "due_date", "status", "is_future", "project_id", "sub_project_id", "area_id", "asset_id", "preferred_supplier_id", "master_preventive_maintenance_id", "created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db46e4be81f86a584b16f2940b" ON "master_preventive_maintenances" ("project_id", "sub_project_id", "area_id", "asset_id", "preferred_supplier_id") `,
    );
  }
}
