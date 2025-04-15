import { MigrationInterface, QueryRunner } from 'typeorm';

export class initMigration1692060442964 implements MigrationInterface {
  name = 'initMigration1692060442964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "manage_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "order_id" character varying NOT NULL, "quantity" integer NOT NULL, "remaining_quantity" integer DEFAULT '0', "estimated_date" TIMESTAMP NOT NULL, "comments" text, "ordered_date" TIMESTAMP NOT NULL, "completed_at" TIMESTAMP, "project_id" uuid NOT NULL, "project_spare_part_id" uuid NOT NULL, CONSTRAINT "PK_bbe0d8fe0f2e90c312746f2786d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_488e307084468992f6f8f22705" ON "manage_orders" ("project_id", "order_id", "project_spare_part_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "spare_part_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "category" character varying NOT NULL, CONSTRAINT "UQ_618ad6668df10b0d9b2c63aa838" UNIQUE ("category"), CONSTRAINT "PK_71710fa03ea45a95f282d532df2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_618ad6668df10b0d9b2c63aa83" ON "spare_part_categories" ("category") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_spare_part_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "project_id" uuid NOT NULL, "part_category_id" uuid NOT NULL, CONSTRAINT "PK_2e12a650a2935ff0a1ac43a3478" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_08e0100d9a276e0be4e578fca2" ON "project_spare_part_categories" ("project_id", "part_category_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "spare_parts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "part_number" character varying NOT NULL, "description" text, CONSTRAINT "UQ_d2a92f4b3dc392cf2cfce4b0a3a" UNIQUE ("part_number"), CONSTRAINT "PK_6fe9b0bb96e021d248731580f1b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d2a92f4b3dc392cf2cfce4b0a3" ON "spare_parts" ("part_number") `,
    );
    await queryRunner.query(
      `CREATE TABLE "master_preventive_maintenance_assignees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "master_preventive_maintenance_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_b2b3fd3777fef334231b3b0e97b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_390fe936bd2d7ed80421473497" ON "master_preventive_maintenance_assignees" ("master_preventive_maintenance_id", "user_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_pm_type_enum" AS ENUM('PM_INTERNAL', 'PM_EXTERNAL')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_day_type_enum" AS ENUM('date', 'day')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_week_enum" AS ENUM('first', 'second', 'third', 'last')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."master_preventive_maintenances_day_enum" AS ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')`,
    );
    await queryRunner.query(
      `CREATE TABLE "master_preventive_maintenances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "pm_type" "public"."master_preventive_maintenances_pm_type_enum" NOT NULL, "due_date" TIMESTAMP NOT NULL, "contract_end_date" TIMESTAMP, "detail" text NOT NULL, "is_recurring" boolean NOT NULL, "frequency" smallint, "notify_before" smallint, "day_type" "public"."master_preventive_maintenances_day_type_enum", "date" smallint, "week" "public"."master_preventive_maintenances_week_enum", "day" "public"."master_preventive_maintenances_day_enum", "project_id" uuid NOT NULL, "sub_project_id" uuid NOT NULL, "area_id" uuid, "asset_id" uuid, "preferred_supplier_id" uuid, CONSTRAINT "PK_90209691e94735b8ba90711e5c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db46e4be81f86a584b16f2940b" ON "master_preventive_maintenances" ("project_id", "sub_project_id", "preferred_supplier_id", "area_id", "asset_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenance_documents_folder_enum" AS ENUM('PM_INSTRUCTIONS', 'COMMERCIAL_DOCS', 'PM_REPORTS', 'IMAGES', 'VIDEOS')`,
    );
    await queryRunner.query(
      `CREATE TABLE "preventive_maintenance_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "folder" "public"."preventive_maintenance_documents_folder_enum" NOT NULL, "file_name" character varying NOT NULL, "file_path" text NOT NULL, "file_type" character varying NOT NULL, "project_id" uuid NOT NULL, "sub_project_id" uuid NOT NULL, "preventive_maintenance_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_54e04abb56614f3e57b08127666" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_pm_type_enum" AS ENUM('PM_INTERNAL', 'PM_EXTERNAL')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_status_enum" AS ENUM('PENDING', 'COMPLETED', 'SKIPPED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_day_type_enum" AS ENUM('date', 'day')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_week_enum" AS ENUM('first', 'second', 'third', 'last')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_day_enum" AS ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')`,
    );
    await queryRunner.query(
      `CREATE TABLE "preventive_maintenances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "pm_type" "public"."preventive_maintenances_pm_type_enum" NOT NULL, "work_id" character varying NOT NULL, "due_date" TIMESTAMP NOT NULL, "contract_end_date" TIMESTAMP, "detail" text NOT NULL, "status" "public"."preventive_maintenances_status_enum" NOT NULL DEFAULT 'PENDING', "is_recurring" boolean NOT NULL, "frequency" smallint, "notify_before" smallint, "day_type" "public"."preventive_maintenances_day_type_enum", "date" smallint, "week" "public"."preventive_maintenances_week_enum", "day" "public"."preventive_maintenances_day_enum", "skipped_at" TIMESTAMP, "completed_at" TIMESTAMP, "is_future" boolean NOT NULL DEFAULT false, "project_id" uuid NOT NULL, "sub_project_id" uuid NOT NULL, "area_id" uuid, "asset_id" uuid, "preferred_supplier_id" uuid, "master_preventive_maintenance_id" uuid NOT NULL, CONSTRAINT "PK_04e788e26633a982f85b985516d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d2eabb41f96cfb7f50e9537857" ON "preventive_maintenances" ("project_id", "sub_project_id", "master_preventive_maintenance_id", "preferred_supplier_id", "area_id", "asset_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "preventive_maintenance_assignees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "preventive_maintenance_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_7aec9bb7ff10460c5b6c40f58cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3350b40ec0abafeff30eef42b9" ON "preventive_maintenance_assignees" ("preventive_maintenance_id", "user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_spare_parts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "preferred_supplier_name" character varying, "system" character varying, "room" character varying, "rack" character varying, "shelf" character varying, "firmware_version" character varying, "minimum_quantity" integer DEFAULT '0', "remaining_quantity" integer DEFAULT '0', "price" numeric DEFAULT '0', "comments" text, "project_id" uuid NOT NULL, "preferred_supplier_id" uuid NOT NULL, "project_part_category_id" uuid NOT NULL, "spare_part_id" uuid NOT NULL, CONSTRAINT "PK_d4262a281c4c9c64765c9452c96" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ccf96c98662b556b243dd009bd" ON "project_spare_parts" ("project_id", "project_part_category_id", "spare_part_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."manage_order_histories_quantity_types_enum" AS ENUM('RESTOCK', 'BORROW')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."manage_order_histories_activity_enum" AS ENUM('Order created', 'Order updated', 'Items received', 'Order completed', 'Items Borrow')`,
    );
    await queryRunner.query(
      `CREATE TABLE "manage_order_histories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "quantity_types" "public"."manage_order_histories_quantity_types_enum" NOT NULL, "activity" "public"."manage_order_histories_activity_enum" NOT NULL, "quantity" integer NOT NULL, "last_spare_part_quantity" integer NOT NULL, "comments" text, "project_id" uuid, "sub_project_id" uuid, "asset_id" uuid, "project_spare_part_id" uuid NOT NULL, "manage_order_id" uuid, CONSTRAINT "PK_01343c15edfab55d48d6b9cc57c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_487f6e9e59829a7a19a0a41179" ON "manage_order_histories" ("project_spare_part_id", "manage_order_id", "project_id", "sub_project_id", "asset_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_orders" ADD CONSTRAINT "FK_4cbead85a69105e197359991645" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_orders" ADD CONSTRAINT "FK_39df6025f4114024b3625a43578" FOREIGN KEY ("project_spare_part_id") REFERENCES "project_spare_parts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_part_categories" ADD CONSTRAINT "FK_701ba30d1fe9630f3cd4db70891" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_part_categories" ADD CONSTRAINT "FK_ccee822e3aa897a46f6642420b2" FOREIGN KEY ("part_category_id") REFERENCES "spare_part_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_assignees" ADD CONSTRAINT "FK_364a0fe2fc766b5ed774890ae51" FOREIGN KEY ("master_preventive_maintenance_id") REFERENCES "master_preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_assignees" ADD CONSTRAINT "FK_42d0577c416152ee9cc9c67e661" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD CONSTRAINT "FK_06193068e3b40961a029831d101" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD CONSTRAINT "FK_a4b3039ec3e10aaeb6e3d507513" FOREIGN KEY ("sub_project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD CONSTRAINT "FK_57ee6abd79f6bdc0aa3b4c49915" FOREIGN KEY ("area_id") REFERENCES "package_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD CONSTRAINT "FK_d852ab3266b6cb89a98ef8b4a12" FOREIGN KEY ("asset_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" ADD CONSTRAINT "FK_fa93500973d6588f91261a54115" FOREIGN KEY ("preferred_supplier_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD CONSTRAINT "FK_d4022c5d1ad76012282cc3f258c" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD CONSTRAINT "FK_a3dc6afbe90080774d3e3900286" FOREIGN KEY ("sub_project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD CONSTRAINT "FK_87c3ca83be70e1f79216d14d6af" FOREIGN KEY ("preventive_maintenance_id") REFERENCES "preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD CONSTRAINT "FK_4e440b666345906661e234d8f6c" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_b51642258f4d291916911579004" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_e655cfc7d1c1d375c73fa91609c" FOREIGN KEY ("sub_project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_5016b729b32250be727a017a18b" FOREIGN KEY ("area_id") REFERENCES "package_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_0c410ce4bec6954be83158ba714" FOREIGN KEY ("asset_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_fb648638d8ec70f620a8472199c" FOREIGN KEY ("preferred_supplier_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_ff010ca923832a9f5d570772dc3" FOREIGN KEY ("master_preventive_maintenance_id") REFERENCES "master_preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_assignees" ADD CONSTRAINT "FK_4fb5e0647d3c64bf34ac229a323" FOREIGN KEY ("preventive_maintenance_id") REFERENCES "preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_assignees" ADD CONSTRAINT "FK_1c6ca126524e84714dd89087949" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" ADD CONSTRAINT "FK_ede6be7bed08c1aa84740fcd5a0" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" ADD CONSTRAINT "FK_dfac135f892e957aea1b79701b8" FOREIGN KEY ("preferred_supplier_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" ADD CONSTRAINT "FK_90b9c50883d27149dedbd052cc9" FOREIGN KEY ("project_part_category_id") REFERENCES "project_spare_part_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" ADD CONSTRAINT "FK_b05385747e75acc0877b0eee435" FOREIGN KEY ("spare_part_id") REFERENCES "spare_parts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ADD CONSTRAINT "FK_04af55f888258e7c187d5738fa9" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ADD CONSTRAINT "FK_a6ac2dad6caac7c7a139011c991" FOREIGN KEY ("sub_project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ADD CONSTRAINT "FK_4b68e007740c3e117d9e3b3fef1" FOREIGN KEY ("asset_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ADD CONSTRAINT "FK_25716fec05fbef862f5b8aa7029" FOREIGN KEY ("project_spare_part_id") REFERENCES "project_spare_parts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ADD CONSTRAINT "FK_502213814d7acfc906efaf08abc" FOREIGN KEY ("manage_order_id") REFERENCES "manage_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`CREATE VIEW "manage_orders_view" AS SELECT project_spare_part_id, SUM(remaining_quantity) as pending_items
    FROM public.manage_orders
    group by project_spare_part_id;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'manage_orders_view',
        'SELECT project_spare_part_id, SUM(remaining_quantity) as pending_items\n    FROM public.manage_orders\n    group by project_spare_part_id;',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'manage_orders_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "manage_orders_view"`);
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" DROP CONSTRAINT "FK_502213814d7acfc906efaf08abc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" DROP CONSTRAINT "FK_25716fec05fbef862f5b8aa7029"`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" DROP CONSTRAINT "FK_4b68e007740c3e117d9e3b3fef1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" DROP CONSTRAINT "FK_a6ac2dad6caac7c7a139011c991"`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" DROP CONSTRAINT "FK_04af55f888258e7c187d5738fa9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" DROP CONSTRAINT "FK_b05385747e75acc0877b0eee435"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" DROP CONSTRAINT "FK_90b9c50883d27149dedbd052cc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" DROP CONSTRAINT "FK_dfac135f892e957aea1b79701b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_parts" DROP CONSTRAINT "FK_ede6be7bed08c1aa84740fcd5a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_assignees" DROP CONSTRAINT "FK_1c6ca126524e84714dd89087949"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_assignees" DROP CONSTRAINT "FK_4fb5e0647d3c64bf34ac229a323"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_ff010ca923832a9f5d570772dc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_fb648638d8ec70f620a8472199c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_0c410ce4bec6954be83158ba714"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_5016b729b32250be727a017a18b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_e655cfc7d1c1d375c73fa91609c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_b51642258f4d291916911579004"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP CONSTRAINT "FK_4e440b666345906661e234d8f6c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP CONSTRAINT "FK_87c3ca83be70e1f79216d14d6af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP CONSTRAINT "FK_a3dc6afbe90080774d3e3900286"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP CONSTRAINT "FK_d4022c5d1ad76012282cc3f258c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP CONSTRAINT "FK_fa93500973d6588f91261a54115"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP CONSTRAINT "FK_d852ab3266b6cb89a98ef8b4a12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP CONSTRAINT "FK_57ee6abd79f6bdc0aa3b4c49915"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP CONSTRAINT "FK_a4b3039ec3e10aaeb6e3d507513"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenances" DROP CONSTRAINT "FK_06193068e3b40961a029831d101"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_assignees" DROP CONSTRAINT "FK_42d0577c416152ee9cc9c67e661"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_assignees" DROP CONSTRAINT "FK_364a0fe2fc766b5ed774890ae51"`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_spare_part_categories" DROP CONSTRAINT "FK_ccee822e3aa897a46f6642420b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_spare_part_categories" DROP CONSTRAINT "FK_701ba30d1fe9630f3cd4db70891"`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_orders" DROP CONSTRAINT "FK_39df6025f4114024b3625a43578"`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_orders" DROP CONSTRAINT "FK_4cbead85a69105e197359991645"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_487f6e9e59829a7a19a0a41179"`,
    );
    await queryRunner.query(`DROP TABLE "manage_order_histories"`);
    await queryRunner.query(
      `DROP TYPE "public"."manage_order_histories_activity_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."manage_order_histories_quantity_types_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ccf96c98662b556b243dd009bd"`,
    );
    await queryRunner.query(`DROP TABLE "project_spare_parts"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3350b40ec0abafeff30eef42b9"`,
    );
    await queryRunner.query(`DROP TABLE "preventive_maintenance_assignees"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d2eabb41f96cfb7f50e9537857"`,
    );
    await queryRunner.query(`DROP TABLE "preventive_maintenances"`);
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_day_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_week_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_day_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_pm_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "preventive_maintenance_documents"`);
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenance_documents_folder_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db46e4be81f86a584b16f2940b"`,
    );
    await queryRunner.query(`DROP TABLE "master_preventive_maintenances"`);
    await queryRunner.query(
      `DROP TYPE "public"."master_preventive_maintenances_day_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."master_preventive_maintenances_week_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."master_preventive_maintenances_day_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."master_preventive_maintenances_pm_type_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_390fe936bd2d7ed80421473497"`,
    );
    await queryRunner.query(
      `DROP TABLE "master_preventive_maintenance_assignees"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d2a92f4b3dc392cf2cfce4b0a3"`,
    );
    await queryRunner.query(`DROP TABLE "spare_parts"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_08e0100d9a276e0be4e578fca2"`,
    );
    await queryRunner.query(`DROP TABLE "project_spare_part_categories"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_618ad6668df10b0d9b2c63aa83"`,
    );
    await queryRunner.query(`DROP TABLE "spare_part_categories"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_488e307084468992f6f8f22705"`,
    );
    await queryRunner.query(`DROP TABLE "manage_orders"`);
  }
}
