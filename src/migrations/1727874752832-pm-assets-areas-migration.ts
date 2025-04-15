import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAssetsAreasMigration1727874752832 implements MigrationInterface {
  name = 'pmAssetsAreasMigration1727874752832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "master_preventive_maintenance_areas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "master_preventive_maintenance_id" uuid NOT NULL, "area_id" uuid NOT NULL, CONSTRAINT "PK_8ec7f186aff5f89dad0cf507d07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_709cf00cbbbe7285f689bd77d0" ON "master_preventive_maintenance_areas" ("master_preventive_maintenance_id", "area_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "master_preventive_maintenance_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "master_preventive_maintenance_id" uuid NOT NULL, "asset_id" uuid NOT NULL, CONSTRAINT "PK_ff3d6898f6b5e764fd0907a322d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc51740dc3ac3d65d6f77c6aea" ON "master_preventive_maintenance_assets" ("master_preventive_maintenance_id", "asset_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "preventive_maintenance_areas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "preventive_maintenance_id" uuid NOT NULL, "area_id" uuid NOT NULL, CONSTRAINT "PK_8e10d597875dda317c6606b98b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e9f54a54812b818c4293b6e641" ON "preventive_maintenance_areas" ("preventive_maintenance_id", "area_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "preventive_maintenance_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "preventive_maintenance_id" uuid NOT NULL, "asset_id" uuid NOT NULL, CONSTRAINT "PK_7125403c006b9737eb4e697abaf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_196346a6da4c60175a74be1a7f" ON "preventive_maintenance_assets" ("preventive_maintenance_id", "asset_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_areas" ADD CONSTRAINT "FK_b3d51e8de63391335d3b23466b5" FOREIGN KEY ("master_preventive_maintenance_id") REFERENCES "master_preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_areas" ADD CONSTRAINT "FK_ec34dc0ea5edd61f2485bc11f67" FOREIGN KEY ("area_id") REFERENCES "package_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_assets" ADD CONSTRAINT "FK_78bff196dc9497e295783837c14" FOREIGN KEY ("master_preventive_maintenance_id") REFERENCES "master_preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_assets" ADD CONSTRAINT "FK_f0570c2d1746236b933555dd4f6" FOREIGN KEY ("asset_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_areas" ADD CONSTRAINT "FK_54486b0216fbba61145cc26b9b4" FOREIGN KEY ("preventive_maintenance_id") REFERENCES "preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_areas" ADD CONSTRAINT "FK_b426e2a39e45d4a5abdcd3612da" FOREIGN KEY ("area_id") REFERENCES "package_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_assets" ADD CONSTRAINT "FK_e3452dc1c52f5178785051cdf35" FOREIGN KEY ("preventive_maintenance_id") REFERENCES "preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_assets" ADD CONSTRAINT "FK_7e4bd1d01062bd523178eb4cf29" FOREIGN KEY ("asset_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_assets" DROP CONSTRAINT "FK_7e4bd1d01062bd523178eb4cf29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_assets" DROP CONSTRAINT "FK_e3452dc1c52f5178785051cdf35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_areas" DROP CONSTRAINT "FK_b426e2a39e45d4a5abdcd3612da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_areas" DROP CONSTRAINT "FK_54486b0216fbba61145cc26b9b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_assets" DROP CONSTRAINT "FK_f0570c2d1746236b933555dd4f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_assets" DROP CONSTRAINT "FK_78bff196dc9497e295783837c14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_areas" DROP CONSTRAINT "FK_ec34dc0ea5edd61f2485bc11f67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_areas" DROP CONSTRAINT "FK_b3d51e8de63391335d3b23466b5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_196346a6da4c60175a74be1a7f"`,
    );
    await queryRunner.query(`DROP TABLE "preventive_maintenance_assets"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e9f54a54812b818c4293b6e641"`,
    );
    await queryRunner.query(`DROP TABLE "preventive_maintenance_areas"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dc51740dc3ac3d65d6f77c6aea"`,
    );
    await queryRunner.query(
      `DROP TABLE "master_preventive_maintenance_assets"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_709cf00cbbbe7285f689bd77d0"`,
    );
    await queryRunner.query(`DROP TABLE "master_preventive_maintenance_areas"`);
  }
}
