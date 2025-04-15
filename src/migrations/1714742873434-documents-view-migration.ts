import { MigrationInterface, QueryRunner } from 'typeorm';

export class documentsViewMigration1714742873434 implements MigrationInterface {
  name = 'documentsViewMigration1714742873434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE VIEW "documents_view" AS SELECT ttd.id,
  'ASSET' as type,
  tags.project_id as sub_project_id,
  projects.master_project_id as project_id,
  ttd.tag_id as asset_id,
  null as area_id,
  ttd.file_name,
  ttd.file_type,
  ttd.file_path,
  ttd.dir_key as folder,
  ttd.created_by_id,
  authentication_user.email as created_by_email,
  authentication_user.first_name as created_by_first_name,
  authentication_user.last_name as created_by_last_name,
  authentication_user.image_url as created_by_image_url,
  ttd.deleted_by_id,
  deleted_by_authentication_user.email as deleted_by_email,
  deleted_by_authentication_user.first_name as deleted_by_first_name,
  deleted_by_authentication_user.last_name as deleted_by_last_name,
  deleted_by_authentication_user.image_url as deleted_by_image_url,
  ttd.is_active,
  ttd.soft_deleted_at,
  ttd.created_at,
  ttd.updated_at
FROM tags_tagdocument ttd
left join tags
   on ttd.tag_id = tags.id
left join projects
   on tags.project_id = projects.id
left join authentication_user
   on ttd.created_by_id = authentication_user.id
left join authentication_user as deleted_by_authentication_user
   on ttd.deleted_by_id = deleted_by_authentication_user.id
UNION
SELECT prd.id,
  'ASSET_PACKAGE' as type,
  pr.project_id as sub_project_id,
  projects.master_project_id as project_id,
  null as asset_id,
  prd.package_id as area_id,
  prd.file_name,
  prd.file_type,
  prd.file_path,
  prd.dir_key as folder,
  prd.created_by_id,
  authentication_user.email as created_by_email,
  authentication_user.first_name as created_by_first_name,
  authentication_user.last_name as created_by_last_name,
  authentication_user.image_url as created_by_image_url,
  prd.deleted_by_id,
  deleted_by_authentication_user.email as deleted_by_email,
  deleted_by_authentication_user.first_name as deleted_by_first_name,
  deleted_by_authentication_user.last_name as deleted_by_last_name,
  deleted_by_authentication_user.image_url as deleted_by_image_url,
  prd.is_active,
  prd.soft_deleted_at,
  prd.created_at,
  prd.updated_at
FROM package_room_documents prd
left join package_rooms pr
   on pr.id = prd.package_id
left join projects
   on pr.project_id = projects.id
left join authentication_user
   on prd.created_by_id = authentication_user.id
left join authentication_user as deleted_by_authentication_user
   on prd.deleted_by_id = deleted_by_authentication_user.id
UNION
SELECT pmd.id,
  pm.pm_type::text,
  pm.project_id,
  pm.sub_project_id,
  pm.asset_id,
  pm.area_id,
  pmd.file_name,
  pmd.file_type,
  pmd.file_path,
  pmd.folder::text,
  pmd.user_id as created_by_id,
  authentication_user.email as created_by_email,
  authentication_user.first_name as created_by_first_name,
  authentication_user.last_name as created_by_last_name,
  authentication_user.image_url as created_by_image_url,
  pmd.deleted_by as deleted_by_id,
  deleted_by_authentication_user.email as deleted_by_email,
  deleted_by_authentication_user.first_name as deleted_by_first_name,
  deleted_by_authentication_user.last_name as deleted_by_last_name,
  deleted_by_authentication_user.image_url as deleted_by_image_url,
  pmd.is_active,
  pmd.soft_deleted_at,
  pmd.created_at,
  pmd.updated_at
FROM preventive_maintenance_documents pmd
left join preventive_maintenances pm
   on pm.id = pmd.preventive_maintenance_id
left join authentication_user
   on pmd.user_id = authentication_user.id
left join authentication_user as deleted_by_authentication_user
   on pmd.deleted_by = deleted_by_authentication_user.id;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'documents_view',
        "SELECT ttd.id,\n  'ASSET' as type,\n  tags.project_id as sub_project_id,\n  projects.master_project_id as project_id,\n  ttd.tag_id as asset_id,\n  null as area_id,\n  ttd.file_name,\n  ttd.file_type,\n  ttd.file_path,\n  ttd.dir_key as folder,\n  ttd.created_by_id,\n  authentication_user.email as created_by_email,\n  authentication_user.first_name as created_by_first_name,\n  authentication_user.last_name as created_by_last_name,\n  authentication_user.image_url as created_by_image_url,\n  ttd.deleted_by_id,\n  deleted_by_authentication_user.email as deleted_by_email,\n  deleted_by_authentication_user.first_name as deleted_by_first_name,\n  deleted_by_authentication_user.last_name as deleted_by_last_name,\n  deleted_by_authentication_user.image_url as deleted_by_image_url,\n  ttd.is_active,\n  ttd.soft_deleted_at,\n  ttd.created_at,\n  ttd.updated_at\nFROM tags_tagdocument ttd\nleft join tags\n   on ttd.tag_id = tags.id\nleft join projects\n   on tags.project_id = projects.id\nleft join authentication_user\n   on ttd.created_by_id = authentication_user.id\nleft join authentication_user as deleted_by_authentication_user\n   on ttd.deleted_by_id = deleted_by_authentication_user.id\nUNION\nSELECT prd.id,\n  'ASSET_PACKAGE' as type,\n  pr.project_id as sub_project_id,\n  projects.master_project_id as project_id,\n  null as asset_id,\n  prd.package_id as area_id,\n  prd.file_name,\n  prd.file_type,\n  prd.file_path,\n  prd.dir_key as folder,\n  prd.created_by_id,\n  authentication_user.email as created_by_email,\n  authentication_user.first_name as created_by_first_name,\n  authentication_user.last_name as created_by_last_name,\n  authentication_user.image_url as created_by_image_url,\n  prd.deleted_by_id,\n  deleted_by_authentication_user.email as deleted_by_email,\n  deleted_by_authentication_user.first_name as deleted_by_first_name,\n  deleted_by_authentication_user.last_name as deleted_by_last_name,\n  deleted_by_authentication_user.image_url as deleted_by_image_url,\n  prd.is_active,\n  prd.soft_deleted_at,\n  prd.created_at,\n  prd.updated_at\nFROM package_room_documents prd\nleft join package_rooms pr\n   on pr.id = prd.package_id\nleft join projects\n   on pr.project_id = projects.id\nleft join authentication_user\n   on prd.created_by_id = authentication_user.id\nleft join authentication_user as deleted_by_authentication_user\n   on prd.deleted_by_id = deleted_by_authentication_user.id\nUNION\nSELECT pmd.id,\n  pm.pm_type::text,\n  pm.project_id,\n  pm.sub_project_id,\n  pm.asset_id,\n  pm.area_id,\n  pmd.file_name,\n  pmd.file_type,\n  pmd.file_path,\n  pmd.folder::text,\n  pmd.user_id as created_by_id,\n  authentication_user.email as created_by_email,\n  authentication_user.first_name as created_by_first_name,\n  authentication_user.last_name as created_by_last_name,\n  authentication_user.image_url as created_by_image_url,\n  pmd.deleted_by as deleted_by_id,\n  deleted_by_authentication_user.email as deleted_by_email,\n  deleted_by_authentication_user.first_name as deleted_by_first_name,\n  deleted_by_authentication_user.last_name as deleted_by_last_name,\n  deleted_by_authentication_user.image_url as deleted_by_image_url,\n  pmd.is_active,\n  pmd.soft_deleted_at,\n  pmd.created_at,\n  pmd.updated_at\nFROM preventive_maintenance_documents pmd\nleft join preventive_maintenances pm\n   on pm.id = pmd.preventive_maintenance_id\nleft join authentication_user\n   on pmd.user_id = authentication_user.id\nleft join authentication_user as deleted_by_authentication_user\n   on pmd.deleted_by = deleted_by_authentication_user.id;",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'documents_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "documents_view"`);
  }
}
