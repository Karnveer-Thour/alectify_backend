import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateEnumsManageOrdersMigration1717164792452
  implements MigrationInterface
{
  name = 'updateEnumsManageOrdersMigration1717164792452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'timelines_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "timelines_view"`);
    await queryRunner.query(
      `ALTER TYPE "public"."manage_order_histories_quantity_types_enum" RENAME TO "manage_order_histories_quantity_types_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."manage_order_histories_quantity_types_enum" AS ENUM('BORROW', 'RESTOCK', 'ORDER')`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ALTER COLUMN "quantity_types" TYPE "public"."manage_order_histories_quantity_types_enum" USING "quantity_types"::"text"::"public"."manage_order_histories_quantity_types_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."manage_order_histories_quantity_types_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."manage_order_histories_activity_enum" RENAME TO "manage_order_histories_activity_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."manage_order_histories_activity_enum" AS ENUM('Order created', 'Order updated', 'Items received', 'Order completed', 'Items Borrow', 'Items Drawn', 'Order Updated', 'Order Created', 'Items Received', 'Items Received & Order Completed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ALTER COLUMN "activity" TYPE "public"."manage_order_histories_activity_enum" USING "activity"::"text"::"public"."manage_order_histories_activity_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."manage_order_histories_activity_enum_old"`,
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
      `CREATE TYPE "public"."manage_order_histories_activity_enum_old" AS ENUM('Items Borrow', 'Items received', 'Order completed', 'Order created', 'Order updated')`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ALTER COLUMN "activity" TYPE "public"."manage_order_histories_activity_enum_old" USING "activity"::"text"::"public"."manage_order_histories_activity_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."manage_order_histories_activity_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."manage_order_histories_activity_enum_old" RENAME TO "manage_order_histories_activity_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."manage_order_histories_quantity_types_enum_old" AS ENUM('BORROW', 'RESTOCK')`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ALTER COLUMN "quantity_types" TYPE "public"."manage_order_histories_quantity_types_enum_old" USING "quantity_types"::"text"::"public"."manage_order_histories_quantity_types_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."manage_order_histories_quantity_types_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."manage_order_histories_quantity_types_enum_old" RENAME TO "manage_order_histories_quantity_types_enum"`,
    );
  }
}
