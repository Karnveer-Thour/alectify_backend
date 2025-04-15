import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmStatusEnumUpdateMigration1719842500968
  implements MigrationInterface
{
  name = 'pmStatusEnumUpdateMigration1719842500968';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'timelines_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "timelines_view"`);
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "in_progress_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "in_progress_by_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."preventive_maintenances_status_enum" RENAME TO "preventive_maintenances_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_status_enum" AS ENUM('PENDING', 'IN PROGRESS', 'WAITING FOR REVIEW', 'COMPLETED', 'SKIPPED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "status" TYPE "public"."preventive_maintenances_status_enum" USING "status"::"text"::"public"."preventive_maintenances_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_status_enum_old"`,
    );

    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_516c9a3425963418f42a7ccc05c" FOREIGN KEY ("in_progress_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`CREATE VIEW "timelines_view" AS SELECT
      preventive_maintenances.id as id, pm_type::text as type, work_title as name, asset_id, area_id, status, detail, null as quantity, null as user_id, null as user_first_name, null as user_last_name, null as user_email, preventive_maintenances.created_at, preventive_maintenances.updated_at, COUNT(comments.id) as comments_count  
      FROM preventive_maintenances left join comments on preventive_maintenances.id::text = comments.reference_id and comments.is_system_generated
      = true where is_future = false group by preventive_maintenances.id
      UNION
      SELECT project_spare_parts.id as id, 'SPARE_PART' as type, spare_parts.part_number as name, asset_id, null as area_id, null as status, spare_parts.description as detail, quantity,authentication_user.id as user_id,authentication_user.first_name as user_first_name, authentication_user.last_name as user_last_name, authentication_user.email as user_email,moh.created_at, moh.updated_at, 0 as comments_count
      FROM manage_order_histories moh
      left join authentication_user on user_id = authentication_user.id 
      left join project_spare_parts on project_spare_part_id = project_spare_parts.id 
      left join spare_parts  on project_spare_parts.spare_part_id  = spare_parts.id 
      where quantity_types = 'BORROW';`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'timelines_view',
        "SELECT\n  preventive_maintenances.id as id, pm_type::text as type, work_title as name, asset_id, area_id, status, detail, null as quantity, null as user_id, null as user_first_name, null as user_last_name, null as user_email, preventive_maintenances.created_at, preventive_maintenances.updated_at, COUNT(comments.id) as comments_count  \n  FROM preventive_maintenances left join comments on preventive_maintenances.id::text = comments.reference_id and comments.is_system_generated\n  = true where is_future = false group by preventive_maintenances.id\n  UNION\n  SELECT project_spare_parts.id as id, 'SPARE_PART' as type, spare_parts.part_number as name, asset_id, null as area_id, null as status, spare_parts.description as detail, quantity,authentication_user.id as user_id,authentication_user.first_name as user_first_name, authentication_user.last_name as user_last_name, authentication_user.email as user_email,moh.created_at, moh.updated_at, 0 as comments_count\n  FROM manage_order_histories moh\n  left join authentication_user on user_id = authentication_user.id \n  left join project_spare_parts on project_spare_part_id = project_spare_parts.id \n  left join spare_parts  on project_spare_parts.spare_part_id  = spare_parts.id \n  where quantity_types = 'BORROW';",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_516c9a3425963418f42a7ccc05c"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."preventive_maintenances_status_enum_old" AS ENUM('COMPLETED', 'PENDING', 'SKIPPED', 'WAITING FOR REVIEW')`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "status" TYPE "public"."preventive_maintenances_status_enum_old" USING "status"::"text"::"public"."preventive_maintenances_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."preventive_maintenances_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."preventive_maintenances_status_enum_old" RENAME TO "preventive_maintenances_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "in_progress_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "in_progress_at"`,
    );
  }
}
