import { MigrationInterface, QueryRunner } from 'typeorm';

export class addApproversPmMigration1713457414359
  implements MigrationInterface
{
  name = 'addApproversPmMigration1713457414359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "preventive_maintenance_approvers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "preventive_maintenance_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_6f98d1c4015f24c280fafcb9d04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87b34ed19ccf0d444c102831f6" ON "preventive_maintenance_approvers" ("preventive_maintenance_id", "user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "master_preventive_maintenance_approvers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "master_preventive_maintenance_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_d23993f0bc5bc0d91f4749f7e0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4d12533dad6668f220447219e9" ON "master_preventive_maintenance_approvers" ("master_preventive_maintenance_id", "user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_approvers" ADD CONSTRAINT "FK_0ff5ca273f0681c53b09bfc024d" FOREIGN KEY ("preventive_maintenance_id") REFERENCES "preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_approvers" ADD CONSTRAINT "FK_c0ffb9ed94971768c1c4506f17b" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_approvers" ADD CONSTRAINT "FK_43a0bde85ce86a9d5936704ddbc" FOREIGN KEY ("master_preventive_maintenance_id") REFERENCES "master_preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_approvers" ADD CONSTRAINT "FK_5e8aaa8a8ff435b74b0c1cb2f4f" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_approvers" DROP CONSTRAINT "FK_5e8aaa8a8ff435b74b0c1cb2f4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_preventive_maintenance_approvers" DROP CONSTRAINT "FK_43a0bde85ce86a9d5936704ddbc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_approvers" DROP CONSTRAINT "FK_c0ffb9ed94971768c1c4506f17b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_approvers" DROP CONSTRAINT "FK_0ff5ca273f0681c53b09bfc024d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4d12533dad6668f220447219e9"`,
    );
    await queryRunner.query(
      `DROP TABLE "master_preventive_maintenance_approvers"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87b34ed19ccf0d444c102831f6"`,
    );
    await queryRunner.query(`DROP TABLE "preventive_maintenance_approvers"`);
  }
}
