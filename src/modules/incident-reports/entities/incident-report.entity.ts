import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseEntity } from '@common/entities/base.entity';
import { Priorities } from 'modules/preventive-maintenances/models/priorities.enum';
import { User } from 'modules/users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { ProjectTeams } from 'modules/projects/entities/project-teams.entity';
import { IncidentReportTeamMembers } from 'modules/incident-report-team-members/entities/incident-report-team-members.entity';
import { IncidentReportDocument } from './incident-report-document.entity';
import { IncidentReportStatuses } from '../models/status.enum';
import { IncidentTypes } from '../models/type.enum';
import { IncidentReportComment } from 'modules/incident-report-comments/entities/incident-report-comment.entity';
import { IncidentReportArea } from './incident-report-areas.entity';
import { IncidentReportAsset } from './incident-report-assets.entity';
import { SubProject } from 'modules/projects/entities/sub-project.entity';
import { ProjectAffectedSystem } from 'modules/projects/entities/project-affected-system.entity';
import { ProjectIncidentImpact } from 'modules/projects/entities/project-incident-impact.entity';

@Entity('incident_reports')
@Index(['project', 'team', 'createdBy'])
export class IncidentReport extends BaseEntity<IncidentReport> {
  // system generated
  @Column({ name: 'incident_id', type: 'varchar', nullable: false })
  incidentId: string;

  // input from client
  @Column({ name: 'incident_no', type: 'varchar', length: 255, nullable: true })
  incidentNo: string;

  @Column({ name: 'title', type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: Priorities,
    nullable: true,
  })
  priority: Priorities;

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

  @ManyToOne(() => ProjectTeams, (pt) => pt.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'team_id' })
  team: ProjectTeams;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @OneToMany(
    () => IncidentReportTeamMembers,
    (irTeamMember) => irTeamMember.incidentReport,
  )
  teamMembers: IncidentReportTeamMembers[];

  @OneToMany(
    () => IncidentReportDocument,
    (irDocument) => irDocument.incidentReport,
  )
  documents: IncidentReportDocument[];

  @Column({ name: 'incident_date', type: 'timestamp', nullable: true })
  incidentDate: Date;

  @Column({ name: 'is_draft', type: 'bool', nullable: true })
  isDraft: boolean;

  @Column({
    type: 'enum',
    enum: IncidentReportStatuses,
    default: IncidentReportStatuses.OPEN,
  })
  status: IncidentReportStatuses;

  @Column({
    name: 'type',
    type: 'enum',
    enum: IncidentTypes,
    default: IncidentTypes.INCIDENT,
  })
  type: IncidentTypes;

  @Column({
    name: 'email_to_client',
    type: 'bool',
    nullable: false,
    default: false,
  })
  emailToClient: boolean;

  @ManyToOne(() => ProjectAffectedSystem, (as) => as.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'affected_system_id' })
  affectedSystem: ProjectAffectedSystem;

  @ManyToOne(() => ProjectIncidentImpact, (impact) => impact.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'impact_id' })
  impact: ProjectIncidentImpact;

  @OneToMany(() => IncidentReportComment, (comment) => comment.incidentReport)
  comments: IncidentReportComment[];

  @OneToMany(() => IncidentReportArea, (area) => area.incidentReport)
  areas: IncidentReportArea[];

  @OneToMany(() => IncidentReportAsset, (asset) => asset.incidentReport)
  assets: IncidentReportAsset[];

  @Column({ name: 'is_active', type: 'bool', nullable: false, default: true })
  isActive: boolean;

  constructor(entity: Partial<IncidentReport>) {
    super(entity);
    Object.assign(this, entity);
  }
}
