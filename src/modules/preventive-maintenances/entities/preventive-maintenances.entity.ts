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
import { Organization } from '../../organizations/entities/organization.entity';
import { PreventiveMaintenanceAssignees } from '../../preventive-maintenance-assignees/entities/preventive-maintenance-assignees.entity';
import { PreventiveMaintenanceDocuments } from '../../preventive-maintenance-documents/entities/preventive-maintenance-documents.entity';
import { Project } from '../../projects/entities/project.entity';
import { SubProject } from '../../projects/entities/sub-project.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { DayTypes } from '../models/day-types.enum';
import { Days } from '../models/days.enum';
import { PMTypes } from '../models/pm-types.enum';
import { Statuses } from '../models/status.enum';
import { Weeks } from '../models/weeks.enum';
import { MasterPreventiveMaintenances } from './master-preventive-maintenances.entity';
import { User } from 'modules/users/entities/user.entity';
import { Procedures } from 'modules/procedures/entities/procedures-entity';
import { TaskCategories } from '../models/task-categories.enum';
import { Priorities } from '../models/priorities.enum';
import { FrequencyTypes } from '../models/frequency-types.enum';
import { Notification } from 'modules/notifications/entities/notification.entity';
import { PreventiveMaintenanceApprovers } from 'modules/preventive-maintenance-approvers/entities/preventive-maintenance-approvers.entity';
import { PreventiveMaintenanceTeamMembers } from 'modules/preventive-maintenance-team-members/entities/preventive-maintenance-team-members.entity';
import { ProjectTeams } from 'modules/projects/entities/project-teams.entity';
import { PreventiveMaintenanceAreas } from 'modules/preventive-maintenance-areas/entities/preventive-maintenance-areas.entity';
import { PreventiveMaintenanceAssets } from 'modules/preventive-maintenance-assets/entities/preventive-maintenance-assets.entity';

const {
  env: {
    AWS_S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_REGION,
  },
} = process;

const s3 = new S3(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_REGION);

@Entity('preventive_maintenances')
@Index([
  'project',
  'subProject',
  'masterPreventiveMaintenance',
  'preferredSupplier',
  'area',
  'asset',
  'pmType',
  'status',
  'isFuture',
  'dueDate',
  'createdBy',
  'team',
])
export class PreventiveMaintenances extends BaseEntity<PreventiveMaintenances> {
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

  @Column({ name: 'work_id', type: 'varchar', nullable: false })
  workId: string;

  @Column({
    name: 'work_title',
    type: 'varchar',
    nullable: true,
  })
  workTitle: string;

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

  @Column({ name: 'due_date', type: 'timestamp', nullable: false })
  dueDate: Date;

  @Column({ name: 'contract_end_date', type: 'timestamp', nullable: true })
  contractEndDate: Date;

  @Column({ name: 'detail', type: 'text', nullable: true })
  detail: string;

  @Column({ name: 'summary', type: 'text', nullable: true })
  summary: string;

  @Column({
    type: 'enum',
    enum: Priorities,
    nullable: true,
  })
  priority: Priorities;

  @Column({
    name: 'status',
    type: 'enum',
    enum: Statuses,
    nullable: false,
    default: Statuses.PENDING,
  })
  status: Statuses;

  @Column({ name: 'is_recurring', type: 'bool', nullable: false })
  isRecurring: boolean;

  @Column({
    name: 'is_reopened',
    type: 'bool',
    default: false,
    nullable: false,
  })
  isReopened: boolean;

  @Column({
    name: 'frequency_type',
    type: 'enum',
    enum: FrequencyTypes,
    nullable: true,
  })
  frequencyType: FrequencyTypes;

  @Column({ name: 'frequency', type: 'smallint', nullable: true })
  frequency: number;

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

  @Column({ name: 'in_progress_at', type: 'timestamp', nullable: true })
  inProgressAt: Date;

  @Column({ name: 'skipped_at', type: 'timestamp', nullable: true })
  skippedAt: Date;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ name: 'completion_at', type: 'timestamp', nullable: true })
  completionAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @ManyToOne(() => Comment, (comment) => comment.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'denied_comment_id' })
  deniedComment: Comment;

  @Column({ name: 'denied_at', type: 'timestamp', nullable: true })
  deniedAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'in_progress_by_id' })
  inProgressBy: User;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'reviewed_by_id' })
  reviewedBy: User;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'completed_by_id' })
  completedBy: User;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'skipped_by_id' })
  skippedBy: User;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'denied_by_id' })
  deniedBy: User;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @ManyToOne(() => Procedures, (procedure) => procedure.id)
  @JoinColumn({ name: 'procedure_id' })
  procedure: Procedures;

  @Column({ name: 'estimated_hours', type: 'varchar', nullable: true })
  estimatedHours: string;

  @Column({ name: 'estimated_cost', type: 'decimal', nullable: true })
  estimatedCost: number;

  @ManyToOne(() => Comment, (comment) => comment.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'review_comment_id' })
  reviewComment: Comment;

  @Column({ name: 'is_future', type: 'bool', default: false, nullable: false })
  isFuture: boolean;

  @Column({ name: 'is_generic', type: 'bool', default: false, nullable: false })
  isGeneric: boolean;

  @OneToMany(
    () => PreventiveMaintenanceAreas,
    (area) => area.preventiveMaintenance,
  )
  areas: PreventiveMaintenanceAreas[];

  @OneToMany(
    () => PreventiveMaintenanceAssets,
    (asset) => asset.preventiveMaintenance,
  )
  assets: PreventiveMaintenanceAssets[];

  @OneToMany(
    () => PreventiveMaintenanceAssignees,
    (pmAssignee) => pmAssignee.preventiveMaintenance,
  )
  assignees: PreventiveMaintenanceAssignees[];

  @OneToMany(
    () => PreventiveMaintenanceApprovers,
    (pmApprover) => pmApprover.preventiveMaintenance,
  )
  approvers: PreventiveMaintenanceApprovers[];

  @OneToMany(
    () => PreventiveMaintenanceTeamMembers,
    (pmTeamMember) => pmTeamMember.preventiveMaintenance,
  )
  teamMembers: PreventiveMaintenanceTeamMembers[];

  @OneToMany(
    () => PreventiveMaintenanceDocuments,
    (pmDocs) => pmDocs.preventiveMaintenance,
  )
  reviewDocuments: PreventiveMaintenanceDocuments[];

  @OneToMany(
    () => PreventiveMaintenanceDocuments,
    (pmDocs) => pmDocs.preventiveMaintenance,
  )
  documents: PreventiveMaintenanceDocuments[];

  @OneToMany(() => Comment, (comment) => comment.referenceId)
  comments: Comment[];

  @OneToMany(
    () => Notification,
    (notification) => notification.preventiveMaintenance,
  )
  notifications: Notification[];

  @ManyToOne(() => MasterPreventiveMaintenances, (mpm) => mpm.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'master_preventive_maintenance_id' })
  masterPreventiveMaintenance: MasterPreventiveMaintenances;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string;

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

  constructor(entity: Partial<PreventiveMaintenances>) {
    super(entity);
    Object.assign(this, entity);
  }
}
