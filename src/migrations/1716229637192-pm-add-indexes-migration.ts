import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAddIndexesMigration1716229637192 implements MigrationInterface {
  name = 'pmAddIndexesMigration1716229637192';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d2eabb41f96cfb7f50e9537857"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_212cfdf230b3224d2b3e3aeaf7" ON "preventive_maintenances" ("project_id", "sub_project_id", "master_preventive_maintenance_id", "preferred_supplier_id", "area_id", "asset_id", "pm_type", "status", "is_future", "due_date", "created_by_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_212cfdf230b3224d2b3e3aeaf7"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d2eabb41f96cfb7f50e9537857" ON "preventive_maintenances" ("project_id", "sub_project_id", "area_id", "asset_id", "preferred_supplier_id", "master_preventive_maintenance_id") `,
    );
  }
}
