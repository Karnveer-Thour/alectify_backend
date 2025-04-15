import { BaseEntity } from '@common/entities/base.entity';
import { ProjectSparePart } from 'modules/spare-parts/entities/project-spare-part.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ManageOrderHistory } from './manage-order-history.entity';
import { Project } from 'modules/projects/entities/project.entity';
import { User } from 'modules/users/entities/user.entity';

@Entity('manage_orders')
@Index(['project', 'orderId', 'projectSparePart'])
export class ManageOrder extends BaseEntity<ManageOrder> {
  @ManyToOne(() => Project, (pro) => pro.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'order_id', type: 'varchar', nullable: false })
  orderId: string;

  @Column({ name: 'quantity', type: 'int4', nullable: false })
  quantity: number;

  @Column({
    name: 'remaining_quantity',
    type: 'int4',
    nullable: true,
    default: 0,
  })
  remainingQuantity: number;

  @Column({ name: 'estimated_date', type: 'timestamp', nullable: true })
  estimatedDate: Date;

  @Column({ name: 'comments', type: 'text', nullable: true })
  comments: string;

  @Column({ name: 'ordered_date', type: 'timestamp', nullable: true })
  orderedDate: Date;

  @Column({ name: 'unit_price', type: 'decimal', nullable: true, default: 0 })
  unitPrice: number;

  @Column({ name: 'po_number', type: 'varchar', nullable: true })
  poNumber: string;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @ManyToOne(() => ProjectSparePart, (psp) => psp.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_spare_part_id' })
  projectSparePart: ProjectSparePart;

  @OneToMany(() => ManageOrderHistory, (moh) => moh.manageOrder)
  manageOrderHistories: ManageOrderHistory[];

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'ordered_by_id' })
  orderedBy: User;

  constructor(entity: Partial<ManageOrder>) {
    super(entity);
    Object.assign(this, entity);
  }
}
