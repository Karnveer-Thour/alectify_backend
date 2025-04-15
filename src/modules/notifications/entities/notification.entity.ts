import { BaseEntity } from '@common/entities/base.entity';
import { ProjectSparePart } from 'modules/spare-parts/entities/project-spare-part.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Area } from '../../areas/entities/area.entity';
import { Asset } from '../../assets/entities/asset.entity';
import { Project } from '../../projects/entities/project.entity';
import { SubProject } from '../../projects/entities/sub-project.entity';
import { NotificationTypes } from '../models/notification-types';
import { User } from '../../users/entities/user.entity';
import { PreventiveMaintenances } from '../../preventive-maintenances/entities/preventive-maintenances.entity';

@Entity('notifications')
@Index(['project', 'subProject', 'projectSparePart', 'area', 'asset'])
export class Notification extends BaseEntity<Notification> {
  @ManyToOne(() => Project, (pro) => pro.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @ManyToOne(() => SubProject, (sp) => sp.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'sub_project_id' })
  subProject?: SubProject;

  @ManyToOne(() => Area, (area) => area.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'area_id' })
  area?: Area;

  @ManyToOne(() => Asset, (asset) => asset.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'asset_id' })
  asset?: Asset;

  @ManyToOne(() => ProjectSparePart, (psp) => psp.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'project_spare_part_id' })
  projectSparePart?: ProjectSparePart;

  @ManyToOne(() => PreventiveMaintenances, (pm) => pm.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'preventive_maintenance_id' })
  preventiveMaintenance?: PreventiveMaintenances;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'message', type: 'text', nullable: false })
  message: string;

  @Column({
    name: 'notification_type',
    type: 'enum',
    enum: NotificationTypes,
    nullable: false,
  })
  notificationType: NotificationTypes;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({
    name: 'is_system_generated',
    type: 'bool',
    default: true,
    nullable: false,
  })
  isSystemGenerated: boolean;

  constructor(entity: Partial<Notification>) {
    super(entity);
    Object.assign(this, entity);
  }
}
