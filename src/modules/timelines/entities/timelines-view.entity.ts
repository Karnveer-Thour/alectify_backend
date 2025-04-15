import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `select preventive_maintenances.id as id, pm_type::text as type, work_title as name, pmas.asset_id as asset_id, NULL::uuid as area_id, status, due_date, detail, NULL::integer as quantity, NULL::uuid AS user_id, NULL::character varying AS user_first_name, NULL::character varying AS user_last_name, NULL::character varying AS user_email, preventive_maintenances.created_at, preventive_maintenances.updated_at, COUNT(comments.id) as comments_count from preventive_maintenances left join comments on preventive_maintenances.id::text = comments.reference_id left join preventive_maintenance_assets pmas on pmas.preventive_maintenance_id = preventive_maintenances.id where is_future = false group by preventive_maintenances.id, pmas.asset_id union select preventive_maintenances.id as id, pm_type::text as type, work_title as name, NULL::uuid as asset_id, pmar.area_id as area_id, status, due_date, detail, NULL::integer as quantity, NULL::uuid AS user_id, NULL::character varying AS user_first_name, NULL::character varying AS user_last_name, NULL::character varying AS user_email, preventive_maintenances.created_at, preventive_maintenances.updated_at, COUNT(comments.id) as comments_count from preventive_maintenances left join comments on preventive_maintenances.id::text = comments.reference_id left join preventive_maintenance_areas pmar on pmar.preventive_maintenance_id = preventive_maintenances.id where is_future = false group by preventive_maintenances.id, pmar.area_id union select project_spare_parts.id as id, 'SPARE_PART' as type, spare_parts.part_number as name, asset_id, area_id, null as status, moh.created_at as due_date, spare_parts.description as detail, quantity, authentication_user.id as user_id, authentication_user.first_name as user_first_name, authentication_user.last_name as user_last_name, authentication_user.email as user_email, moh.created_at, moh.updated_at, 0 as comments_count from manage_order_histories moh left join authentication_user on user_id = authentication_user.id left join project_spare_parts on project_spare_part_id = project_spare_parts.id left join spare_parts on project_spare_parts.spare_part_id = spare_parts.id where quantity_types = 'BORROW';
`,
  name: 'timelines_view',
})
export class TimelinesView {
  @ViewColumn({
    name: 'id',
  })
  id: string;

  @ViewColumn()
  type: string;

  @ViewColumn()
  name: string;

  @ViewColumn({
    name: 'asset_id',
  })
  assetId: string;

  @ViewColumn({
    name: 'area_id',
  })
  areaId: string;

  @ViewColumn({
    name: 'status',
  })
  status: string;

  @ViewColumn({
    name: 'due_date',
  })
  dueDate: string;

  @ViewColumn({
    name: 'detail',
  })
  detail: string;

  @ViewColumn({
    name: 'quantity',
  })
  quantity: number;

  @ViewColumn({
    name: 'user_id',
  })
  userId: string;

  @ViewColumn({
    name: 'user_first_name',
  })
  userFirstName: string;

  @ViewColumn({
    name: 'user_last_name',
  })
  userLastName: string;

  @ViewColumn({
    name: 'user_email',
  })
  userEmail: string;

  @ViewColumn({
    name: 'comments_count',
  })
  commentsCount: number;

  @ViewColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @ViewColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
