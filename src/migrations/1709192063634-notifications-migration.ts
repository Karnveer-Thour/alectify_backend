import { MigrationInterface, QueryRunner } from 'typeorm';

export class notificationsMigration1709192063634 implements MigrationInterface {
  name = 'notificationsMigration1709192063634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_notification_type_enum" AS ENUM('PM_INTERNAL', 'PM_EXTERNAL', 'TASK', 'SPARE_PART', 'ASSET', 'ASSET_PACKAGE', 'PROJECT', 'SUB_PROJECT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "message" text NOT NULL, "notification_type" "public"."notifications_notification_type_enum" NOT NULL, "project_id" uuid, "sub_project_id" uuid, "area_id" uuid, "asset_id" uuid, "project_spare_part_id" uuid, "user_id" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fe829d976f9ed1d6dd8f4408b9" ON "notifications" ("project_id", "sub_project_id", "project_spare_part_id", "area_id", "asset_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_read" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, "notification_id" uuid NOT NULL, CONSTRAINT "PK_9242665f4612d827ce1912bca57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_76c0c7cd32e7c9cc6650d351fa" ON "notification_users" ("user_id", "notification_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_95464140d7dc04d7efb0afd6be0" FOREIGN KEY ("project_id") REFERENCES "master_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_6ad2efe26e252abb06e8c656174" FOREIGN KEY ("sub_project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_3011aef5a33ac5c190654c05d7a" FOREIGN KEY ("area_id") REFERENCES "package_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_4bddd455aad7f9c6e33196ae5ae" FOREIGN KEY ("asset_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_62ff804f0529deb5bc4ca636e45" FOREIGN KEY ("project_spare_part_id") REFERENCES "project_spare_parts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_users" ADD CONSTRAINT "FK_e73f283b2e2b842b231ede5e4af" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_users" ADD CONSTRAINT "FK_76de091ca3bc0d093cd648a0570" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_users" DROP CONSTRAINT "FK_76de091ca3bc0d093cd648a0570"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_users" DROP CONSTRAINT "FK_e73f283b2e2b842b231ede5e4af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_62ff804f0529deb5bc4ca636e45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_4bddd455aad7f9c6e33196ae5ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_3011aef5a33ac5c190654c05d7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_6ad2efe26e252abb06e8c656174"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_95464140d7dc04d7efb0afd6be0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_76c0c7cd32e7c9cc6650d351fa"`,
    );
    await queryRunner.query(`DROP TABLE "notification_users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fe829d976f9ed1d6dd8f4408b9"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(
      `DROP TYPE "public"."notifications_notification_type_enum"`,
    );
  }
}
