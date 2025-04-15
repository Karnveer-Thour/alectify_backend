import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from 'modules/users/entities/user.entity';
import { IncidentReport } from 'modules/incident-reports/entities/incident-report.entity';
import { IncidentReportCommentFile } from './incident-report-comment-file.entity';

@Entity('incident_report_comments')
@Index(['incidentReport', 'createdBy'])
export class IncidentReportComment extends BaseEntity<IncidentReportComment> {
  @Column({ name: 'description', type: 'text', nullable: false })
  description: string;

  @Column({ name: 'actions', type: 'text', nullable: true })
  actions: string;

  @Column({
    name: 'system_state',
    type: 'text',
    nullable: true,
  })
  systemState: string;

  @Column({ name: 'call_at', type: 'timestamp', nullable: true })
  callAt: Date;

  @Column({ name: 'next_update_at', type: 'timestamp', nullable: true })
  nextUpdateAt: Date;

  @ManyToOne(() => IncidentReport, (incident) => incident.comments, {
    nullable: false,
  })
  @JoinColumn({ name: 'incident_report_id' })
  incidentReport: IncidentReport;

  @Column({ name: 'incident_summary', type: 'text', nullable: true })
  incidentSummary: string;

  @Column({
    name: 'is_system_generated',
    type: 'bool',
    default: true,
    nullable: false,
  })
  isSystemGenerated: boolean;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @OneToMany(
    () => IncidentReportCommentFile,
    (ircf) => ircf.incidentReportComment,
  )
  files: IncidentReportComment[];

  @Column({
    name: 'unknown_user_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  unknownUserName: string;

  constructor(entity: Partial<IncidentReportComment>) {
    super(entity);
    Object.assign(this, entity);
  }
}
