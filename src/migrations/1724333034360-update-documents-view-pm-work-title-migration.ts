import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateDocumentsViewPmWorkTitleMigration1724333034360
  implements MigrationInterface
{
  name = 'updateDocumentsViewPmWorkTitleMigration1724333034360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'documents_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "documents_view"`);
    await queryRunner.query(`CREATE VIEW "documents_view" 
AS SELECT ttd.id,
    'ASSET'::text AS type,
    null AS work_title,
    tags.project_id AS sub_project_id,
    projects.master_project_id AS project_id,
    ttd.tag_id AS asset_id,
    NULL::uuid AS area_id,
    ttd.file_name,
    ttd.file_type,
    ttd.file_path,
    ttd.dir_key AS folder,
    ttd.created_by_id,
    authentication_user.email AS created_by_email,
    authentication_user.first_name AS created_by_first_name,
    authentication_user.last_name AS created_by_last_name,
    authentication_user.image_url AS created_by_image_url,
    authentication_user.user_type AS created_by_user_type,
    ttd.deleted_by_id,
    deleted_by_authentication_user.email AS deleted_by_email,
    deleted_by_authentication_user.first_name AS deleted_by_first_name,
    deleted_by_authentication_user.last_name AS deleted_by_last_name,
    deleted_by_authentication_user.image_url AS deleted_by_image_url,
    deleted_by_authentication_user.user_type AS deleted_by_user_type,
    ttd.is_active,
    ttd.comment,
    ttd.recovered_at,
    ttd.recovered_by_id,
    ttd.soft_deleted_at,
    ttd.created_at,
    ttd.updated_at
   FROM tags_tagdocument ttd
     LEFT JOIN tags ON ttd.tag_id = tags.id
     LEFT JOIN projects ON tags.project_id = projects.id
     LEFT JOIN authentication_user ON ttd.created_by_id = authentication_user.id
     LEFT JOIN authentication_user deleted_by_authentication_user ON ttd.deleted_by_id = deleted_by_authentication_user.id
UNION
 SELECT prd.id,
    'ASSET_PACKAGE'::text AS type,
    null AS work_title,
    pr.project_id AS sub_project_id,
    projects.master_project_id AS project_id,
    NULL::uuid AS asset_id,
    prd.package_id AS area_id,
    prd.file_name,
    prd.file_type,
    prd.file_path,
    prd.dir_key AS folder,
    prd.created_by_id,
    authentication_user.email AS created_by_email,
    authentication_user.first_name AS created_by_first_name,
    authentication_user.last_name AS created_by_last_name,
    authentication_user.image_url AS created_by_image_url,
    authentication_user.user_type AS created_by_user_type,
    prd.deleted_by_id,
    deleted_by_authentication_user.email AS deleted_by_email,
    deleted_by_authentication_user.first_name AS deleted_by_first_name,
    deleted_by_authentication_user.last_name AS deleted_by_last_name,
    deleted_by_authentication_user.image_url AS deleted_by_image_url,
    deleted_by_authentication_user.user_type AS deleted_by_user_type,
    prd.is_active,
    prd.comment,
    prd.recovered_at,
    prd.recovered_by_id,
    prd.soft_deleted_at,
    prd.created_at,
    prd.updated_at
   FROM package_room_documents prd
     LEFT JOIN package_rooms pr ON pr.id = prd.package_id
     LEFT JOIN projects ON pr.project_id = projects.id
     LEFT JOIN authentication_user ON prd.created_by_id = authentication_user.id
     LEFT JOIN authentication_user deleted_by_authentication_user ON prd.deleted_by_id = deleted_by_authentication_user.id
UNION
 SELECT pmd.id,
    pm.pm_type::text AS type,
    pm.work_title AS work_title,
    pm.sub_project_id AS sub_project_id,
    pm.project_id AS project_id,
    pm.asset_id,
    pm.area_id,
    pmd.file_name,
    pmd.file_type,
    pmd.file_path,
    pmd.folder::text AS folder,
    pmd.user_id AS created_by_id,
    authentication_user.email AS created_by_email,
    authentication_user.first_name AS created_by_first_name,
    authentication_user.last_name AS created_by_last_name,
    authentication_user.image_url AS created_by_image_url,
    authentication_user.user_type AS created_by_user_type,
    pmd.deleted_by AS deleted_by_id,
    deleted_by_authentication_user.email AS deleted_by_email,
    deleted_by_authentication_user.first_name AS deleted_by_first_name,
    deleted_by_authentication_user.last_name AS deleted_by_last_name,
    deleted_by_authentication_user.image_url AS deleted_by_image_url,
    deleted_by_authentication_user.user_type AS deleted_by_user_type,
    pmd.is_active,
    pmd.comment,
    pmd.recovered_at,
    pmd.recovered_by AS recovered_by_id,
    pmd.soft_deleted_at,
    pmd.created_at,
    pmd.updated_at
   FROM preventive_maintenance_documents pmd
     LEFT JOIN preventive_maintenances pm ON pm.id = pmd.preventive_maintenance_id
     LEFT JOIN authentication_user ON pmd.user_id = authentication_user.id
     LEFT JOIN authentication_user deleted_by_authentication_user ON pmd.deleted_by = deleted_by_authentication_user.id;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'documents_view',
        "CREATE OR REPLACE VIEW public.documents_view\nAS SELECT ttd.id,\n    'ASSET'::text AS type,\n    null AS work_title,\n    tags.project_id AS sub_project_id,\n    projects.master_project_id AS project_id,\n    ttd.tag_id AS asset_id,\n    NULL::uuid AS area_id,\n    ttd.file_name,\n    ttd.file_type,\n    ttd.file_path,\n    ttd.dir_key AS folder,\n    ttd.created_by_id,\n    authentication_user.email AS created_by_email,\n    authentication_user.first_name AS created_by_first_name,\n    authentication_user.last_name AS created_by_last_name,\n    authentication_user.image_url AS created_by_image_url,\n    authentication_user.user_type AS created_by_user_type,\n    ttd.deleted_by_id,\n    deleted_by_authentication_user.email AS deleted_by_email,\n    deleted_by_authentication_user.first_name AS deleted_by_first_name,\n    deleted_by_authentication_user.last_name AS deleted_by_last_name,\n    deleted_by_authentication_user.image_url AS deleted_by_image_url,\n    deleted_by_authentication_user.user_type AS deleted_by_user_type,\n    ttd.is_active,\n    ttd.comment,\n    ttd.recovered_at,\n    ttd.recovered_by_id,\n    ttd.soft_deleted_at,\n    ttd.created_at,\n    ttd.updated_at\n   FROM tags_tagdocument ttd\n     LEFT JOIN tags ON ttd.tag_id = tags.id\n     LEFT JOIN projects ON tags.project_id = projects.id\n     LEFT JOIN authentication_user ON ttd.created_by_id = authentication_user.id\n     LEFT JOIN authentication_user deleted_by_authentication_user ON ttd.deleted_by_id = deleted_by_authentication_user.id\nUNION\n SELECT prd.id,\n    'ASSET_PACKAGE'::text AS type,\n    null AS work_title,\n    pr.project_id AS sub_project_id,\n    projects.master_project_id AS project_id,\n    NULL::uuid AS asset_id,\n    prd.package_id AS area_id,\n    prd.file_name,\n    prd.file_type,\n    prd.file_path,\n    prd.dir_key AS folder,\n    prd.created_by_id,\n    authentication_user.email AS created_by_email,\n    authentication_user.first_name AS created_by_first_name,\n    authentication_user.last_name AS created_by_last_name,\n    authentication_user.image_url AS created_by_image_url,\n    authentication_user.user_type AS created_by_user_type,\n    prd.deleted_by_id,\n    deleted_by_authentication_user.email AS deleted_by_email,\n    deleted_by_authentication_user.first_name AS deleted_by_first_name,\n    deleted_by_authentication_user.last_name AS deleted_by_last_name,\n    deleted_by_authentication_user.image_url AS deleted_by_image_url,\n    deleted_by_authentication_user.user_type AS deleted_by_user_type,\n    prd.is_active,\n    prd.comment,\n    prd.recovered_at,\n    prd.recovered_by_id,\n    prd.soft_deleted_at,\n    prd.created_at,\n    prd.updated_at\n   FROM package_room_documents prd\n     LEFT JOIN package_rooms pr ON pr.id = prd.package_id\n     LEFT JOIN projects ON pr.project_id = projects.id\n     LEFT JOIN authentication_user ON prd.created_by_id = authentication_user.id\n     LEFT JOIN authentication_user deleted_by_authentication_user ON prd.deleted_by_id = deleted_by_authentication_user.id\nUNION\n SELECT pmd.id,\n    pm.pm_type::text AS type,\n    pm.work_title AS work_title,\n    pm.sub_project_id AS sub_project_id,\n    pm.project_id AS project_id,\n    pm.asset_id,\n    pm.area_id,\n    pmd.file_name,\n    pmd.file_type,\n    pmd.file_path,\n    pmd.folder::text AS folder,\n    pmd.user_id AS created_by_id,\n    authentication_user.email AS created_by_email,\n    authentication_user.first_name AS created_by_first_name,\n    authentication_user.last_name AS created_by_last_name,\n    authentication_user.image_url AS created_by_image_url,\n    authentication_user.user_type AS created_by_user_type,\n    pmd.deleted_by AS deleted_by_id,\n    deleted_by_authentication_user.email AS deleted_by_email,\n    deleted_by_authentication_user.first_name AS deleted_by_first_name,\n    deleted_by_authentication_user.last_name AS deleted_by_last_name,\n    deleted_by_authentication_user.image_url AS deleted_by_image_url,\n    deleted_by_authentication_user.user_type AS deleted_by_user_type,\n    pmd.is_active,\n    pmd.comment,\n    pmd.recovered_at,\n    pmd.recovered_by AS recovered_by_id,\n    pmd.soft_deleted_at,\n    pmd.created_at,\n    pmd.updated_at\n   FROM preventive_maintenance_documents pmd\n     LEFT JOIN preventive_maintenances pm ON pm.id = pmd.preventive_maintenance_id\n     LEFT JOIN authentication_user ON pmd.user_id = authentication_user.id\n     LEFT JOIN authentication_user deleted_by_authentication_user ON pmd.deleted_by = deleted_by_authentication_user.id;",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'documents_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "documents_view"`);
    await queryRunner.query(`CREATE VIEW "documents_view" AS SELECT ttd.id,
    'ASSET'::text AS type,
    tags.project_id AS sub_project_id,
    projects.master_project_id AS project_id,
    ttd.tag_id AS asset_id,
    NULL::uuid AS area_id,
    ttd.file_name,
    ttd.file_type,
    ttd.file_path,
    ttd.dir_key AS folder,
    ttd.created_by_id,
    authentication_user.email AS created_by_email,
    authentication_user.first_name AS created_by_first_name,
    authentication_user.last_name AS created_by_last_name,
    authentication_user.image_url AS created_by_image_url,
    authentication_user.user_type AS created_by_user_type,
    ttd.deleted_by_id,
    deleted_by_authentication_user.email AS deleted_by_email,
    deleted_by_authentication_user.first_name AS deleted_by_first_name,
    deleted_by_authentication_user.last_name AS deleted_by_last_name,
    deleted_by_authentication_user.image_url AS deleted_by_image_url,
    deleted_by_authentication_user.user_type AS deleted_by_user_type,
    ttd.is_active,
    ttd.comment,
    ttd.recovered_at,
    ttd.recovered_by_id,
    ttd.soft_deleted_at,
    ttd.created_at,
    ttd.updated_at
   FROM tags_tagdocument ttd
     LEFT JOIN tags ON ttd.tag_id = tags.id
     LEFT JOIN projects ON tags.project_id = projects.id
     LEFT JOIN authentication_user ON ttd.created_by_id = authentication_user.id
     LEFT JOIN authentication_user deleted_by_authentication_user ON ttd.deleted_by_id = deleted_by_authentication_user.id
UNION
 SELECT prd.id,
    'ASSET_PACKAGE'::text AS type,
    pr.project_id AS sub_project_id,
    projects.master_project_id AS project_id,
    NULL::uuid AS asset_id,
    prd.package_id AS area_id,
    prd.file_name,
    prd.file_type,
    prd.file_path,
    prd.dir_key AS folder,
    prd.created_by_id,
    authentication_user.email AS created_by_email,
    authentication_user.first_name AS created_by_first_name,
    authentication_user.last_name AS created_by_last_name,
    authentication_user.image_url AS created_by_image_url,
    authentication_user.user_type AS created_by_user_type,
    prd.deleted_by_id,
    deleted_by_authentication_user.email AS deleted_by_email,
    deleted_by_authentication_user.first_name AS deleted_by_first_name,
    deleted_by_authentication_user.last_name AS deleted_by_last_name,
    deleted_by_authentication_user.image_url AS deleted_by_image_url,
    deleted_by_authentication_user.user_type AS deleted_by_user_type,
    prd.is_active,
    prd.comment,
    prd.recovered_at,
    prd.recovered_by_id,
    prd.soft_deleted_at,
    prd.created_at,
    prd.updated_at
   FROM package_room_documents prd
     LEFT JOIN package_rooms pr ON pr.id = prd.package_id
     LEFT JOIN projects ON pr.project_id = projects.id
     LEFT JOIN authentication_user ON prd.created_by_id = authentication_user.id
     LEFT JOIN authentication_user deleted_by_authentication_user ON prd.deleted_by_id = deleted_by_authentication_user.id
UNION
 SELECT pmd.id,
    pm.pm_type::text AS type,
    pm.sub_project_id AS sub_project_id,
    pm.project_id AS project_id,
    pm.asset_id,
    pm.area_id,
    pmd.file_name,
    pmd.file_type,
    pmd.file_path,
    pmd.folder::text AS folder,
    pmd.user_id AS created_by_id,
    authentication_user.email AS created_by_email,
    authentication_user.first_name AS created_by_first_name,
    authentication_user.last_name AS created_by_last_name,
    authentication_user.image_url AS created_by_image_url,
    authentication_user.user_type AS created_by_user_type,
    pmd.deleted_by AS deleted_by_id,
    deleted_by_authentication_user.email AS deleted_by_email,
    deleted_by_authentication_user.first_name AS deleted_by_first_name,
    deleted_by_authentication_user.last_name AS deleted_by_last_name,
    deleted_by_authentication_user.image_url AS deleted_by_image_url,
    deleted_by_authentication_user.user_type AS deleted_by_user_type,
    pmd.is_active,
    pmd.comment,
    pmd.recovered_at,
    pmd.recovered_by AS recovered_by_id,
    pmd.soft_deleted_at,
    pmd.created_at,
    pmd.updated_at
   FROM preventive_maintenance_documents pmd
     LEFT JOIN preventive_maintenances pm ON pm.id = pmd.preventive_maintenance_id
     LEFT JOIN authentication_user ON pmd.user_id = authentication_user.id
     LEFT JOIN authentication_user deleted_by_authentication_user ON pmd.deleted_by = deleted_by_authentication_user.id;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'documents_view',
        "CREATE OR REPLACE VIEW public.documents_view\nAS SELECT ttd.id,\n    'ASSET'::text AS type,\n    tags.project_id AS sub_project_id,\n    projects.master_project_id AS project_id,\n    ttd.tag_id AS asset_id,\n    NULL::uuid AS area_id,\n    ttd.file_name,\n    ttd.file_type,\n    ttd.file_path,\n    ttd.dir_key AS folder,\n    ttd.created_by_id,\n    authentication_user.email AS created_by_email,\n    authentication_user.first_name AS created_by_first_name,\n    authentication_user.last_name AS created_by_last_name,\n    authentication_user.image_url AS created_by_image_url,\n    authentication_user.user_type AS created_by_user_type,\n    ttd.deleted_by_id,\n    deleted_by_authentication_user.email AS deleted_by_email,\n    deleted_by_authentication_user.first_name AS deleted_by_first_name,\n    deleted_by_authentication_user.last_name AS deleted_by_last_name,\n    deleted_by_authentication_user.image_url AS deleted_by_image_url,\n    deleted_by_authentication_user.user_type AS deleted_by_user_type,\n    ttd.is_active,\n    ttd.comment,\n    ttd.recovered_at,\n    ttd.recovered_by_id,\n    ttd.soft_deleted_at,\n    ttd.created_at,\n    ttd.updated_at\n   FROM tags_tagdocument ttd\n     LEFT JOIN tags ON ttd.tag_id = tags.id\n     LEFT JOIN projects ON tags.project_id = projects.id\n     LEFT JOIN authentication_user ON ttd.created_by_id = authentication_user.id\n     LEFT JOIN authentication_user deleted_by_authentication_user ON ttd.deleted_by_id = deleted_by_authentication_user.id\nUNION\n SELECT prd.id,\n    'ASSET_PACKAGE'::text AS type,\n    pr.project_id AS sub_project_id,\n    projects.master_project_id AS project_id,\n    NULL::uuid AS asset_id,\n    prd.package_id AS area_id,\n    prd.file_name,\n    prd.file_type,\n    prd.file_path,\n    prd.dir_key AS folder,\n    prd.created_by_id,\n    authentication_user.email AS created_by_email,\n    authentication_user.first_name AS created_by_first_name,\n    authentication_user.last_name AS created_by_last_name,\n    authentication_user.image_url AS created_by_image_url,\n    authentication_user.user_type AS created_by_user_type,\n    prd.deleted_by_id,\n    deleted_by_authentication_user.email AS deleted_by_email,\n    deleted_by_authentication_user.first_name AS deleted_by_first_name,\n    deleted_by_authentication_user.last_name AS deleted_by_last_name,\n    deleted_by_authentication_user.image_url AS deleted_by_image_url,\n    deleted_by_authentication_user.user_type AS deleted_by_user_type,\n    prd.is_active,\n    prd.comment,\n    prd.recovered_at,\n    prd.recovered_by_id,\n    prd.soft_deleted_at,\n    prd.created_at,\n    prd.updated_at\n   FROM package_room_documents prd\n     LEFT JOIN package_rooms pr ON pr.id = prd.package_id\n     LEFT JOIN projects ON pr.project_id = projects.id\n     LEFT JOIN authentication_user ON prd.created_by_id = authentication_user.id\n     LEFT JOIN authentication_user deleted_by_authentication_user ON prd.deleted_by_id = deleted_by_authentication_user.id\nUNION\n SELECT pmd.id,\n    pm.pm_type::text AS type,\n    pm.sub_project_id AS sub_project_id,\n    pm.project_id AS project_id,\n    pm.asset_id,\n    pm.area_id,\n    pmd.file_name,\n    pmd.file_type,\n    pmd.file_path,\n    pmd.folder::text AS folder,\n    pmd.user_id AS created_by_id,\n    authentication_user.email AS created_by_email,\n    authentication_user.first_name AS created_by_first_name,\n    authentication_user.last_name AS created_by_last_name,\n    authentication_user.image_url AS created_by_image_url,\n    authentication_user.user_type AS created_by_user_type,\n    pmd.deleted_by AS deleted_by_id,\n    deleted_by_authentication_user.email AS deleted_by_email,\n    deleted_by_authentication_user.first_name AS deleted_by_first_name,\n    deleted_by_authentication_user.last_name AS deleted_by_last_name,\n    deleted_by_authentication_user.image_url AS deleted_by_image_url,\n    deleted_by_authentication_user.user_type AS deleted_by_user_type,\n    pmd.is_active,\n    pmd.comment,\n    pmd.recovered_at,\n    pmd.recovered_by AS recovered_by_id,\n    pmd.soft_deleted_at,\n    pmd.created_at,\n    pmd.updated_at\n   FROM preventive_maintenance_documents pmd\n     LEFT JOIN preventive_maintenances pm ON pm.id = pmd.preventive_maintenance_id\n     LEFT JOIN authentication_user ON pmd.user_id = authentication_user.id\n     LEFT JOIN authentication_user deleted_by_authentication_user ON pmd.deleted_by = deleted_by_authentication_user.id;",
      ],
    );
  }
}
