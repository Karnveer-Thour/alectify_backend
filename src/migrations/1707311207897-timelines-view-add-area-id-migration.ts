import { MigrationInterface, QueryRunner } from 'typeorm';

export class timelinesViewAddAreaIdMigration1707311207897
  implements MigrationInterface
{
  name = 'timelinesViewAddAreaIdMigration1707311207897';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'timelines_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "timelines_view"`);

    await queryRunner.query(`CREATE VIEW "timelines_view" AS SELECT
  id, pm_type::text as type, work_title as name, asset_id, area_id, status, detail, null as quantity, null as user_id, null as user_first_name, null as user_last_name, null as user_email, created_at, updated_at  
  FROM preventive_maintenances where is_future = false
  UNION
  SELECT project_spare_parts.id as id, 'SPARE_PART' as type, spare_parts.part_number as name, asset_id, null as area_id, null as status, spare_parts.description as detail, quantity,authentication_user.id as user_id,authentication_user.first_name as user_first_name, authentication_user.last_name as user_last_name, authentication_user.email as user_email,moh.created_at, moh.updated_at 
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
        "SELECT\n  id, pm_type::text as type, work_title as name, asset_id, area_id, status, detail, null as quantity, null as user_id, null as user_first_name, null as user_last_name, null as user_email, created_at, updated_at  \n  FROM preventive_maintenances where is_future = false\n  UNION\n  SELECT project_spare_parts.id as id, 'SPARE_PART' as type, spare_parts.part_number as name, asset_id, null as area_id, null as status, spare_parts.description as detail, quantity,authentication_user.id as user_id,authentication_user.first_name as user_first_name, authentication_user.last_name as user_last_name, authentication_user.email as user_email,moh.created_at, moh.updated_at \n  FROM manage_order_histories moh\n  left join authentication_user on user_id = authentication_user.id \n  left join project_spare_parts on project_spare_part_id = project_spare_parts.id \n  left join spare_parts  on project_spare_parts.spare_part_id  = spare_parts.id \n  where quantity_types = 'BORROW';",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'timelines_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "timelines_view"`);
    await queryRunner.query(`CREATE VIEW "timelines_view" AS SELECT
  id, pm_type::text as type, work_title as name, asset_id, status, detail, null as quantity, null as user_id, null as user_first_name, null as user_last_name, null as user_email, created_at, updated_at  
  FROM preventive_maintenances where asset_id IS NOT null and is_future = false
  UNION
  SELECT project_spare_parts.id as id, 'SPARE_PART' as type, spare_parts.part_number as name, asset_id, null as status, spare_parts.description as detail, quantity,authentication_user.id as user_id,authentication_user.first_name as user_first_name, authentication_user.last_name as user_last_name, authentication_user.email as user_email,moh.created_at, moh.updated_at 
  FROM manage_order_histories moh
  left join authentication_user on user_id = authentication_user.id 
  left join project_spare_parts on project_spare_part_id = project_spare_parts.id 
  left join spare_parts  on project_spare_parts.spare_part_id  = spare_parts.id 
  where quantity_types = 'BORROW' and asset_id IS NOT NULL;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'timelines_view',
        "SELECT\n  id, pm_type::text as type, work_title as name, asset_id, status, detail, null as quantity, null as user_id, null as user_first_name, null as user_last_name, null as user_email, created_at, updated_at  \n  FROM preventive_maintenances where asset_id IS NOT null and is_future = false\n  UNION\n  SELECT project_spare_parts.id as id, 'SPARE_PART' as type, spare_parts.part_number as name, asset_id, null as status, spare_parts.description as detail, quantity,authentication_user.id as user_id,authentication_user.first_name as user_first_name, authentication_user.last_name as user_last_name, authentication_user.email as user_email,moh.created_at, moh.updated_at \n  FROM manage_order_histories moh\n  left join authentication_user on user_id = authentication_user.id \n  left join project_spare_parts on project_spare_part_id = project_spare_parts.id \n  left join spare_parts  on project_spare_parts.spare_part_id  = spare_parts.id \n  where quantity_types = 'BORROW' and asset_id IS NOT NULL;",
      ],
    );
  }
}
