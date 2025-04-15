import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Branch } from '../../users/entities/branch.entity';
import { Permission } from '../../users/entities/permission.entity';
import { Area } from '../../areas/entities/area.entity';
import { Asset } from '../../assets/entities/asset.entity';
import { ManageOrderHistory } from '../../manage-orders/entities/manage-order-history.entity';
import { MasterPreventiveMaintenances } from '../../preventive-maintenances/entities/master-preventive-maintenances.entity';
import { PreventiveMaintenances } from '../../preventive-maintenances/entities/preventive-maintenances.entity';
import { PreventiveMaintenanceDocuments } from '../../preventive-maintenance-documents/entities/preventive-maintenance-documents.entity';
import { IncidentReport } from 'modules/incident-reports/entities/incident-report.entity';

@Entity('projects')
@Index('projects_branch_id_62f78435', ['branch'], {})
@Index('projects_created_by_id_7e51a33d', ['createdBy'], {})
// @Index('projects_pkey', ['id'], { unique: true })
@Index('projects_master_project_id_517cba55', ['project'], {})
export class SubProject {
  @Column({ primary: true, name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  description: string;

  @Column({ name: 'is_active', type: 'int', nullable: true })
  isActive: number;

  @Column({ name: 'owner', type: 'varchar', nullable: true, length: 255 })
  owner: string;

  @Column({ name: 'address', type: 'varchar', nullable: true, length: 255 })
  address: string;

  @Column({
    name: 'work_id_prefix',
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  workIdPrefix: string;

  @Column({
    name: 'latitude',
    type: 'double precision',
    nullable: true,
  })
  latitude: number;

  @Column({
    name: 'longitude',
    type: 'double precision',
    nullable: true,
  })
  longitude: number;

  @Column({ name: 'is_construction', type: 'boolean', nullable: true })
  isConstruction: boolean;

  @Column({ name: 'is_operational', type: 'boolean', nullable: true })
  isOperational: boolean;

  @Column({ name: 'is_finished', type: 'boolean', nullable: true })
  isFinished: boolean;

  @Column({ name: 'is_draft', type: 'boolean', nullable: true })
  isDraft: boolean | null;

  @ManyToOne(() => Branch, (branch) => branch.projects)
  @JoinColumn([{ name: 'branch_id', referencedColumnName: 'id' }])
  branch: Branch;

  @ManyToOne(() => Project, (project) => project.subProjects)
  @JoinColumn([{ name: 'master_project_id', referencedColumnName: 'id' }])
  project: Project;

  @ManyToOne(() => User, (user) => user.subProject)
  @JoinColumn([{ name: 'created_by_id', referencedColumnName: 'id' }])
  createdBy: User;

  @OneToMany(() => Permission, (permission) => permission.subProject)
  permissions: Permission[];

  @OneToMany(() => Area, (area) => area.subProject)
  areas: Area[];

  @OneToMany(() => Asset, (asset) => asset.subProject)
  assets: Asset[];

  @OneToMany(() => ManageOrderHistory, (moh) => moh.subProject)
  manageOrderHistories: ManageOrderHistory[];

  @OneToMany(() => PreventiveMaintenances, (pm) => pm.subProject)
  preventiveMaintenances: PreventiveMaintenances[];

  @OneToMany(() => MasterPreventiveMaintenances, (mpm) => mpm.subProject)
  masterPreventiveMaintenances: MasterPreventiveMaintenances[];

  @OneToMany(() => PreventiveMaintenanceDocuments, (pmd) => pmd.subProject)
  preventiveMaintenanceDocuments: PreventiveMaintenanceDocuments[];

  @OneToMany(() => Comment, (comment) => comment.subProject)
  comment: Comment[];

  @OneToMany(() => IncidentReport, (ir) => ir.subProject)
  incidentReport: IncidentReport[];

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  constructor(entity: Partial<SubProject>) {
    Object.assign(this, entity);
  }
}
