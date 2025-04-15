import { ProjectSparePart } from 'modules/spare-parts/entities/project-spare-part.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ManageOrderHistory } from '../../manage-orders/entities/manage-order-history.entity';
import { ManageOrder } from '../../manage-orders/entities/manage-order.entity';
import { PreventiveMaintenanceDocuments } from '../../preventive-maintenance-documents/entities/preventive-maintenance-documents.entity';
import { MasterPreventiveMaintenances } from '../../preventive-maintenances/entities/master-preventive-maintenances.entity';
import { PreventiveMaintenances } from '../../preventive-maintenances/entities/preventive-maintenances.entity';
import { ProjectSparePartCategory } from '../../spare-part-categories/entities/project-spare-part-category.entity';
import { Branch } from '../../users/entities/branch.entity';
import { User } from '../../users/entities/user.entity';
import { ProjectAccount } from './project-account.entity';
import { ProjectTeams } from './project-teams.entity';
import { SubProject } from './sub-project.entity';
import { ProjectAffectedSystem } from './project-affected-system.entity';
import { ProjectIncidentImpact } from './project-incident-impact.entity';

@Entity('master_projects')
@Index('master_projects_branch_id_04035b6e', ['branch'], {})
@Index('master_projects_created_by_id_2c3cd1c0', ['createdBy'], {})
export class Project {
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
    name: 'color',
    type: 'varchar',
    nullable: false,
    length: 7,
  })
  color: string;

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

  @Column({ name: 'site_code', type: 'varchar', nullable: true, length: 25 })
  siteCode: string;

  @Column({ name: 'is_finished', type: 'boolean', nullable: true })
  isFinished: boolean;

  @Column({ name: 'is_draft', type: 'boolean', nullable: true })
  isDraft: boolean;

  @ManyToOne(() => Branch, (branch) => branch.masterProjects)
  @JoinColumn([{ name: 'branch_id', referencedColumnName: 'id' }])
  branch: Branch;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn([{ name: 'created_by_id', referencedColumnName: 'id' }])
  createdBy: User;

  @OneToMany(() => ManageOrder, (mo) => mo.project)
  manageOrder: ManageOrder[];

  @OneToMany(() => SubProject, (projects) => projects.project)
  subProjects: SubProject[];

  @OneToMany(() => ManageOrderHistory, (moh) => moh.project)
  manageOrderHistories: ManageOrderHistory[];

  @OneToMany(() => PreventiveMaintenances, (pm) => pm.project)
  preventiveMaintenances: PreventiveMaintenances[];

  @OneToMany(() => MasterPreventiveMaintenances, (mpm) => mpm.project)
  masterPreventiveMaintenances: MasterPreventiveMaintenances[];

  @OneToMany(() => PreventiveMaintenanceDocuments, (pmd) => pmd.project)
  preventiveMaintenanceDocuments: PreventiveMaintenanceDocuments[];

  @OneToMany(() => ProjectSparePartCategory, (psc) => psc.project)
  projectSparePartCategory: ProjectSparePartCategory[];

  @OneToMany(() => ProjectSparePart, (psc) => psc.project)
  projectSparePart: ProjectSparePart[];

  @OneToMany(() => ProjectAccount, (pa) => pa.project)
  projectsAccounts: ProjectAccount[];

  @OneToMany(() => ProjectTeams, (pt) => pt.project)
  projectTeams: ProjectTeams[];

  @OneToMany(() => ProjectIncidentImpact, (pii) => pii.project)
  incidentImpacts: ProjectIncidentImpact[];

  @OneToMany(() => ProjectAffectedSystem, (pas) => pas.project)
  affectedSystems: ProjectAffectedSystem[];

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  constructor(entity: Partial<Project>) {
    Object.assign(this, entity);
  }
}
