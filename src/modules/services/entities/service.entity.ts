import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Priorities } from '../models/priorities.enum';
import { TaskCategories } from '../models/task-categories.enum';
import { ServiceStatuses } from '../models/service-statuses.enum';
import { SubProject } from 'modules/projects/entities/sub-project.entity';
import { Asset } from 'modules/assets/entities/asset.entity';
import { Area } from 'modules/areas/entities/area.entity';
import { Procedures } from 'modules/procedures/entities/procedures-entity';
import { ProceduresLibrary } from 'modules/procedures/entities/procedures-library-entity';
import { ServicesUsers } from './services-users.entity';

@Entity()
@Index(['subProject', 'asset', 'status', 'createdBy', 'completedBy'])
export class Services {
  @ManyToOne(() => SubProject, (sp) => sp.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_id' })
  subProject: SubProject;

  @ManyToOne(() => Asset, (asset) => asset.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'tag_id' })
  asset: Asset;

  @ManyToOne(() => Area, (area) => area.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  // @ManyToOne(() => Procedures, (mprocedure) => mprocedure.id)
  // @JoinColumn({ name: 'procedure_id' })
  // procedure: Procedures;

  // @ManyToOne(() => ProceduresLibrary, (procedure) => procedure.id)
  // @JoinColumn({ name: 'procedure_library_id' })
  // procedureLibrary: ProceduresLibrary;

  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  wid: string;

  @Column({ name: 'estimated_hours', type: 'varchar', nullable: true })
  estimatedHours: string;

  @Column({ name: 'estimated_cost', type: 'decimal', nullable: true })
  estimatedCost: number;

  @Column({ name: 'scheduled_at', type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @CreateDateColumn()
  created_at: 'datetime';

  @UpdateDateColumn()
  updated_at: 'datetime';

  @Column('text', {
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: Priorities,
    default: Priorities.NORMAL,
  })
  priorities: Priorities;

  @Column({
    name: 'task_category',
    type: 'enum',
    enum: TaskCategories,
    default: TaskCategories.OTHERS,
  })
  taskCategory: TaskCategories;

  @Column({
    type: 'enum',
    enum: ServiceStatuses,
    default: ServiceStatuses.SCHEDULED,
  })
  status: ServiceStatuses;

  @Column({
    name: 'is_completed',
    type: 'boolean',
    default: false,
  })
  isCompleted: boolean;

  @Column({
    name: 'is_approved',
    type: 'boolean',
    default: false,
  })
  isApproved: boolean;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'quotation_request_at', type: 'timestamp', nullable: true })
  quotationRequestAt: Date;

  @Column({ name: 'po_request_at', type: 'timestamp', nullable: true })
  poRequestAt: Date;

  @Column({ name: 'waiting_review_at', type: 'timestamp', nullable: true })
  waitingReviewAt: Date;

  @Column({
    name: 'created_by',
    type: 'uuid',
    nullable: true,
  })
  createdBy: string;

  @Column({
    name: 'completed_by',
    type: 'uuid',
    nullable: true,
  })
  completedBy: string;

  @OneToMany(() => ServicesUsers, (su) => su.service)
  serviceUsers: ServicesUsers[];
}
