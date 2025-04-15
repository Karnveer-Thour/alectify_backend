import { BaseEntity } from '@common/entities/base.entity';
import { Area } from 'modules/areas/entities/area.entity';
import { Asset } from 'modules/assets/entities/asset.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Project } from '../..//projects/entities/project.entity';
import { PreventiveMaintenances } from '../../preventive-maintenances/entities/preventive-maintenances.entity';
import { SubProject } from '../../projects/entities/sub-project.entity';
import { User } from '../../users/entities/user.entity';
import { Folders } from '../models/folders.enum';

@Entity('documents')
@Index([
  'project',
  'subProject',
  'preventiveMaintenance',
  'asset',
  'area',
  'createdBy',
  'deletedBy',
  'recoveredBy',
])
export class Documents extends BaseEntity<Documents> {
  @ManyToOne(() => Project, (pro) => pro.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => SubProject, (sp) => sp.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'sub_project_id' })
  subProject: SubProject;

  @ManyToOne(() => PreventiveMaintenances, (pm) => pm.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'preventive_maintenance_id' })
  preventiveMaintenance: PreventiveMaintenances;

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

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({
    name: 'folder',
    type: 'enum',
    enum: Folders,
    nullable: false,
  })
  folder: Folders;

  @Column({ name: 'file_name', type: 'varchar', nullable: false })
  fileName: string;

  @Column({ name: 'file_path', type: 'text', nullable: false })
  filePath: string;

  @Column({ name: 'file_type', type: 'varchar', nullable: false })
  fileType: string;

  @Column({ name: 'is_active', type: 'bool', nullable: false, default: true })
  isActive: boolean;

  @Column({
    name: 'soft_deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  softDeletedAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'deleted_by' })
  deletedBy: User;

  @Column({ name: 'comment', type: 'varchar', nullable: true })
  comment: string;

  @Column({
    name: 'recovered_at',
    type: 'timestamp',
    nullable: true,
  })
  recoveredAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'recovered_by' })
  recoveredBy: User;

  constructor(entity: Partial<Documents>) {
    super(entity);
    Object.assign(this, entity);
  }
}
