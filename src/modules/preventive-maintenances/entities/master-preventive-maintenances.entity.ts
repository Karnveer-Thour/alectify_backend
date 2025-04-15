import { BaseEntity } from '@common/entities/base.entity';
import {
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { S3 } from '@common/helpers/s3';
import { Area } from '../../areas/entities/area.entity';
import { Asset } from '../../assets/entities/asset.entity';
import { MasterPreventiveMaintenanceAssignees } from '../../preventive-maintenance-assignees/entities/master-preventive-maintenance-assignees.entity';
import { Project } from '../../projects/entities/project.entity';
import { SubProject } from '../../projects/entities/sub-project.entity';
import { DayTypes } from '../models/day-types.enum';
import { Days } from '../models/days.enum';
import { PMTypes } from '../models/pm-types.enum';
import { Weeks } from '../models/weeks.enum';
import { PreventiveMaintenances } from './preventive-maintenances.entity';
import { Organization } from 'modules/organizations/entities/organization.entity';
import { User } from 'modules/users/entities/user.entity';
import { ProceduresLibrary } from 'modules/procedures/entities/procedures-library-entity';
import { TaskCategories } from '../models/task-categories.enum';
import { Priorities } from '../models/priorities.enum';
import { FrequencyTypes } from '../models/frequency-types.enum';
import { MasterPreventiveMaintenanceApprovers } from 'modules/preventive-maintenance-approvers/entities/master-preventive-maintenance-approvers.entity';
import { MasterPreventiveMaintenanceTeamMembers } from 'modules/preventive-maintenance-team-members/entities/master-preventive-maintenance-team-members.entity';
import { ProjectTeams } from 'modules/projects/entities/project-teams.entity';
import { MasterPreventiveMaintenanceAreas } from 'modules/preventive-maintenance-areas/entities/master-preventive-maintenance-areas.entity';
import { MasterPreventiveMaintenanceAssets } from 'modules/preventive-maintenance-assets/entities/master-preventive-maintenance-assets.entity';
import { MasterPreventiveMaintenanceImages } from 'modules/master-preventive-maintenance-documents/entities/master-preventive-maintenance-images.entity';
import { MasterPreventiveMaintenanceFiles } from 'modules/master-preventive-maintenance-documents/entities/master-preventive-maintenance-files.entity';

const {
  env: {
    AWS_S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_REGION,
  },
} = process;

const s3 = new S3(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_REGION);
@Entity('master_preventive_maintenances')
@Index([
  'project',
  'subProject',
  'preferredSupplier',
  'area',
  'asset',
  'pmType',
  'procedureLibrary',
  'dueDate',
  'createdBy',
  'team',
])
export class MasterPreventiveMaintenances extends BaseEntity<MasterPreventiveMaintenances> {
  @Column({
    name: 'pm_type',
    type: 'enum',
    enum: PMTypes,
    nullable: false,
  })
  pmType: PMTypes;

  @Column({
    name: 'task_category',
    type: 'enum',
    enum: TaskCategories,
    nullable: true,
  })
  taskCategory: TaskCategories;

  @ManyToOne(() => Project, (pro) => pro.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => SubProject, (sp) => sp.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'sub_project_id' })
  subProject: SubProject;

  @ManyToOne(() => Area, (area) => area.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @ManyToOne(() => Asset, (asset) => asset.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @ManyToOne(() => Organization, (organization) => organization.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'preferred_supplier_id' })
  preferredSupplier: Organization;

  @ManyToOne(() => ProjectTeams, (pt) => pt.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'team_id' })
  team: ProjectTeams;

  @Column({
    name: 'work_title',
    type: 'varchar',
    nullable: true,
  })
  workTitle: string;

  @Column({ name: 'due_date', type: 'timestamp', nullable: false })
  dueDate: Date;

  @Column({ name: 'contract_end_date', type: 'timestamp', nullable: true })
  contractEndDate: Date;

  @Column({ name: 'detail', type: 'text', nullable: true })
  detail: string;

  @Column({
    type: 'enum',
    enum: Priorities,
    nullable: true,
  })
  priority: Priorities;

  @Column({ name: 'is_recurring', type: 'bool', nullable: false })
  isRecurring: boolean;

  @Column({ name: 'frequency', type: 'smallint', nullable: true })
  frequency: number;

  @Column({
    name: 'frequency_type',
    type: 'enum',
    enum: FrequencyTypes,
    nullable: true,
  })
  frequencyType: FrequencyTypes;

  @Column({ name: 'notify_before', type: 'smallint', nullable: true })
  notifyBefore: number;

  @Column({
    name: 'day_type',
    type: 'enum',
    enum: DayTypes,
    nullable: true,
  })
  dayType: DayTypes;

  @Column({ name: 'date', type: 'smallint', nullable: true })
  date: number;

  @Column({ name: 'week', type: 'enum', enum: Weeks, nullable: true })
  week: Weeks;

  @Column({ name: 'day', type: 'enum', enum: Days, nullable: true })
  day: Days;

  @Column({ name: 'is_generic', type: 'bool', default: false, nullable: false })
  isGeneric: boolean;

  @Column({ name: 'is_active', type: 'bool', default: true, nullable: false })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @OneToMany(
    () => MasterPreventiveMaintenanceAreas,
    (area) => area.masterPreventiveMaintenance,
  )
  areas: MasterPreventiveMaintenanceAreas[];

  @OneToMany(
    () => MasterPreventiveMaintenanceAssets,
    (asset) => asset.masterPreventiveMaintenance,
  )
  assets: MasterPreventiveMaintenanceAssets[];

  @ManyToOne(() => ProceduresLibrary, (procedure) => procedure.id)
  @JoinColumn({ name: 'procedure_library_id' })
  procedureLibrary: ProceduresLibrary;

  @OneToMany(
    () => MasterPreventiveMaintenanceAssignees,
    (mpmAssignees) => mpmAssignees.masterPreventiveMaintenance,
  )
  assignees: MasterPreventiveMaintenanceAssignees[];

  @OneToMany(
    () => MasterPreventiveMaintenanceApprovers,
    (mpmApprover) => mpmApprover.masterPreventiveMaintenance,
  )
  approvers: MasterPreventiveMaintenanceApprovers[];

  @OneToMany(
    () => MasterPreventiveMaintenanceTeamMembers,
    (mpmTeamMember) => mpmTeamMember.masterPreventiveMaintenance,
  )
  teamMembers: MasterPreventiveMaintenanceTeamMembers[];

  @OneToMany(
    () => PreventiveMaintenances,
    (pm) => pm.masterPreventiveMaintenance,
  )
  preventiveMaintenances: PreventiveMaintenances[];

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string;

  @OneToMany(
    () => MasterPreventiveMaintenanceImages,
    (mpmImages) => mpmImages.masterPreventiveMaintenance,
  )
  images: MasterPreventiveMaintenanceImages[];

  @OneToMany(
    () => MasterPreventiveMaintenanceFiles,
    (mpmFiles) => mpmFiles.masterPreventiveMaintenance,
  )
  files: MasterPreventiveMaintenanceFiles[];

  @AfterLoad()
  async populateSignedURLs() {
    if (this.imageUrl) {
      const signedUrl = await s3.privateSignedUrl(
        AWS_S3_BUCKET_NAME,
        this.imageUrl,
        604800,
      );
      this.imageUrl = signedUrl;
    } else {
      this.imageUrl = this.imageUrl;
    }
  }

  constructor(entity: Partial<MasterPreventiveMaintenances>) {
    super(entity);
    Object.assign(this, entity);
  }
}
