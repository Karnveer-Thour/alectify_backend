import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmTeamMembersMigration1717418314233 implements MigrationInterface {
  name = 'pmTeamMembersMigration1717418314233';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "preventive_maintenance_team_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "preventive_maintenance_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_8051c7c7cbc2d6b7381401e9360" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ff3ebce2c87b5f337b82d73ad" ON "preventive_maintenance_team_members" ("preventive_maintenance_id", "user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "master_preventive_maintenance_team_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "master_preventive_maintenance_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_bbbebe122f27a619c19c7359af4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_613d840122c0f9f21298c0f253" ON "master_preventive_maintenance_team_members" ("master_preventive_maintenance_id", "user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_team_members" ADD CONSTRAINT "FK_8198f4a31c086f9b32fe5874fa9" FOREIGN KEY ("preventive_maintenance_id") REFERENCES "preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_team_members" ADD CONSTRAINT "FK_798680e4046c7f4404ad5238878" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_team_members" ADD CONSTRAINT "FK_7fa9c05daaed45dab9bf537970b" FOREIGN KEY ("master_preventive_maintenance_id") REFERENCES "master_preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_team_members" ADD CONSTRAINT "FK_5d7f72f8d818cc9b8a49cee495e" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_team_members" DROP CONSTRAINT "FK_5d7f72f8d818cc9b8a49cee495e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_team_members" DROP CONSTRAINT "FK_7fa9c05daaed45dab9bf537970b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_team_members" DROP CONSTRAINT "FK_798680e4046c7f4404ad5238878"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_team_members" DROP CONSTRAINT "FK_8198f4a31c086f9b32fe5874fa9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_613d840122c0f9f21298c0f253"`,
    );
    await queryRunner.query(
      `DROP TABLE "master_preventive_maintenance_team_members"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1ff3ebce2c87b5f337b82d73ad"`,
    );
    await queryRunner.query(`DROP TABLE "preventive_maintenance_team_members"`);
  }
}
