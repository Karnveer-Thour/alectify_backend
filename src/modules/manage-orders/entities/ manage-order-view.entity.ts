import { ProjectSparePart } from 'modules/spare-parts/entities/project-spare-part.entity';
import { JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `SELECT project_spare_part_id, SUM(remaining_quantity) as pending_items
    FROM public.manage_orders
    group by project_spare_part_id;`,
  name: 'manage_orders_view',
})
export class ManageOrderView {
  @ViewColumn({
    name: 'pending_items',
  })
  pendingItems: number;

  @ManyToOne(() => ProjectSparePart, (psp) => psp.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_spare_part_id' })
  projectSparePart: ProjectSparePart;
}
