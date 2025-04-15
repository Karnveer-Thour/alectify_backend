import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { SubProject } from '../../projects/entities/sub-project.entity';
import { ProjectSparePart } from '../../spare-parts/entities/project-spare-part.entity';
import { ActivityMessages } from '../models/activity-messages.enum';
import { QuantityTypes } from '../models/quantity-types.enum';
import { ManageOrder } from './manage-order.entity';
import { Asset } from 'modules/assets/entities/asset.entity';
import { User } from 'modules/users/entities/user.entity';
import { Area } from 'modules/areas/entities/area.entity';
import { PreventiveMaintenances } from 'modules/preventive-maintenances/entities/preventive-maintenances.entity';

@Entity('manage_order_histories')
@Index([
  'projectSparePart',
  'manageOrder',
  'project',
  'subProject',
  'asset',
  'area',
])
export class ManageOrderHistory extends BaseEntity<ManageOrderHistory> {
  @ManyToOne(() => Project, (pro) => pro.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => SubProject, (sp) => sp.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'sub_project_id' })
  subProject: SubProject;

  @ManyToOne(() => Asset, (asset) => asset.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @ManyToOne(() => Area, (area) => area.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @ManyToOne(() => PreventiveMaintenances, (pm) => pm.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'preventive_maintenance_id' })
  preventiveMaintenance: PreventiveMaintenances;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'quantity_types',
    type: 'enum',
    enum: QuantityTypes,
    nullable: false,
  })
  quantityType: QuantityTypes; // RESTOCK = REFILL, BORROW = DRAW

  @Column({
    name: 'activity',
    type: 'enum',
    enum: ActivityMessages,
    nullable: false,
  })
  activity: ActivityMessages;

  @Column({
    name: 'quantity',
    type: 'int4',
    nullable: false,
  })
  quantity: number;

  @Column({ name: 'price', type: 'decimal', nullable: true, default: 0 })
  price: number;

  @Column({
    name: 'last_spare_part_quantity',
    type: 'int4',
    nullable: false,
  })
  lastSparePartQuantity: number;

  @Column({ name: 'comments', type: 'text', nullable: true })
  comments: string;

  @ManyToOne(() => ProjectSparePart, (psp) => psp.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_spare_part_id' })
  projectSparePart: ProjectSparePart;

  @ManyToOne(() => ManageOrder, (mo) => mo.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'manage_order_id' })
  manageOrder: ManageOrder;

  constructor(entity: Partial<ManageOrderHistory>) {
    super(entity);
    Object.assign(this, entity);
  }
}
