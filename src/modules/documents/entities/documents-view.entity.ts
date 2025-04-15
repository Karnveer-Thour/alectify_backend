import { AfterLoad, ViewColumn, ViewEntity } from 'typeorm';
import { S3 } from '@common/helpers/s3';

const {
  env: {
    AWS_S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_REGION,
  },
} = process;

const s3 = new S3(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_REGION);

@ViewEntity({
  expression: `SELECT ttd.id,
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
    pmas.asset_id,
    pmar.area_id,
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
     LEFT JOIN authentication_user deleted_by_authentication_user ON pmd.deleted_by = deleted_by_authentication_user.id
     LEFT JOIN preventive_maintenance_areas pmar ON pmar.preventive_maintenance_id = pmd.preventive_maintenance_id
     LEFT JOIN preventive_maintenance_assets pmas ON pmas.preventive_maintenance_id = pmd.preventive_maintenance_id;`,
  name: 'documents_view',
})
export class DocumentsView {
  @ViewColumn({
    name: 'id',
  })
  id: string;

  @ViewColumn()
  type: string;

  @ViewColumn({
    name: 'work_title',
  })
  workTitle: string;

  @ViewColumn({
    name: 'project_id',
  })
  projectId: string;

  @ViewColumn({
    name: 'sub_project_id',
  })
  subProjectId: string;

  @ViewColumn({
    name: 'asset_id',
  })
  assetId: string;

  @ViewColumn({
    name: 'area_id',
  })
  areaId: string;

  @ViewColumn({
    name: 'file_name',
  })
  fileName: string;

  @ViewColumn({
    name: 'file_type',
  })
  fileType: string;

  @ViewColumn({
    name: 'file_path',
  })
  filePath: string;

  @ViewColumn({
    name: 'folder',
  })
  folder: string;

  @ViewColumn({
    name: 'created_by_id',
  })
  createdById: string;

  @ViewColumn({
    name: 'created_by_email',
  })
  createdByEmail: string;

  @ViewColumn({
    name: 'created_by_first_name',
  })
  createdByFirstName: string;

  @ViewColumn({
    name: 'created_by_last_name',
  })
  createdByLastName: string;

  @ViewColumn({
    name: 'created_by_user_type',
  })
  createdByUserType: string;

  @ViewColumn({
    name: 'created_by_image_url',
  })
  createdByImageUrl: string;

  @ViewColumn({
    name: 'deleted_by_id',
  })
  deletedById: string;

  @ViewColumn({
    name: 'deleted_by_email',
  })
  deletedByEmail: string;

  @ViewColumn({
    name: 'deleted_by_first_name',
  })
  deletedByFirstName: string;

  @ViewColumn({
    name: 'deleted_by_last_name',
  })
  deletedByLastName: string;

  @ViewColumn({
    name: 'deleted_by_user_type',
  })
  deletedByUserType: string;

  @ViewColumn({
    name: 'deleted_by_image_url',
  })
  deletedByImageUrl: string;

  @ViewColumn({
    name: 'is_active',
  })
  isActive: boolean;

  @ViewColumn({
    name: 'comment',
  })
  comment: string;

  @ViewColumn({
    name: 'recovered_at',
  })
  recoveredAt: Date;

  @ViewColumn({
    name: 'recovered_by_id',
  })
  recoveredById: string;

  @ViewColumn({
    name: 'soft_deleted_at',
  })
  softDeletedAt: Date;

  @ViewColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @ViewColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @AfterLoad()
  async populateSignedURLs() {
    if (
      this.createdByImageUrl &&
      !this.createdByImageUrl?.startsWith('https://ui-avatars.com')
    ) {
      const signedUrl = await s3.privateSignedUrl(
        AWS_S3_BUCKET_NAME,
        this.createdByImageUrl,
        604800,
      );
      this.createdByImageUrl = signedUrl;
    } else {
      this.createdByImageUrl = this.createdByImageUrl;
    }

    if (
      this.deletedByImageUrl &&
      !this.deletedByImageUrl?.startsWith('https://ui-avatars.com')
    ) {
      const signedUrl = await s3.privateSignedUrl(
        AWS_S3_BUCKET_NAME,
        this.deletedByImageUrl,
        604800,
      );
      this.deletedByImageUrl = signedUrl;
    } else {
      this.deletedByImageUrl = this.deletedByImageUrl;
    }
  }
}
