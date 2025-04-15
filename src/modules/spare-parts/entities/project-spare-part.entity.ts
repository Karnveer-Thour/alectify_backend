import { BaseEntity } from '@common/entities/base.entity';
import { ManageOrderView } from 'modules/manage-orders/entities/ manage-order-view.entity';
import { ManageOrderHistory } from 'modules/manage-orders/entities/manage-order-history.entity';
import { ManageOrder } from 'modules/manage-orders/entities/manage-order.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { ProjectSparePartCategory } from '../../spare-part-categories/entities/project-spare-part-category.entity';
import { SparePart } from './spare-part.entity';
import { Organization } from 'modules/organizations/entities/organization.entity';

@Entity('project_spare_parts')
@Index(['project', 'projectSparePartCategory', 'sparePart'])
export class ProjectSparePart extends BaseEntity<ProjectSparePart> {
  @ManyToOne(() => Project, (pro) => pro.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Organization, (organization) => organization.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'preferred_supplier_id' })
  preferredSupplier: Organization;

  @Column({ name: 'system', type: 'varchar', nullable: true })
  system: string;

  @Column({ name: 'room', type: 'varchar', nullable: true })
  room: string;

  @Column({ name: 'rack', type: 'varchar', nullable: true })
  rack: string;

  @Column({ name: 'shelf', type: 'varchar', nullable: true })
  shelf: string;

  @Column({ name: 'firmware_version', type: 'varchar', nullable: true })
  firmwareVersion: string;

  @Column({
    name: 'minimum_quantity',
    type: 'int4',
    nullable: true,
    default: 0,
  })
  minimumQuantity: number;

  @Column({
    name: 'remaining_quantity',
    type: 'int4',
    nullable: true,
    default: 0,
  })
  remainingQuantity: number;

  @Column({ name: 'price', type: 'decimal', nullable: true, default: 0 })
  price: number; // @TODO: should be available in history as well

  @Column({ name: 'comments', type: 'text', nullable: true })
  comments: string;

  @Column({ name: 'summary', type: 'text', nullable: true })
  summary: string;

  @Column({ name: 'is_summary', type: 'bool', default: false, nullable: false })
  isSummary: boolean;

  @Column({
    name: 'is_advisory',
    type: 'bool',
    default: false,
    nullable: false,
  })
  isAdvisory: boolean;

  @ManyToOne(() => ProjectSparePartCategory, (ppc) => ppc.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'project_part_category_id' })
  projectSparePartCategory: ProjectSparePartCategory;

  @ManyToOne(() => SparePart, (sp) => sp.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'spare_part_id' })
  sparePart: SparePart;

  @OneToMany(() => ManageOrderHistory, (moh) => moh.projectSparePart)
  manageOrderHistories: ManageOrderHistory[];

  @OneToMany(() => ManageOrder, (mo) => mo.projectSparePart)
  manageOrders: ManageOrder[];

  @OneToOne(() => ManageOrderView, (mov) => mov.projectSparePart)
  manageOrdersView: ManageOrderView;

  constructor(entity: Partial<ProjectSparePart>) {
    super(entity);
    Object.assign(this, entity);
  }
}
