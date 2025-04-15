import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { IncidentReport } from 'modules/incident-reports/entities/incident-report.entity';
import { User } from '../../users/entities/user.entity';

@Entity('incident_report_team_members')
@Index(['incidentReport', 'user'])
export class IncidentReportTeamMembers extends BaseEntity<IncidentReportTeamMembers> {
  @ManyToOne(() => IncidentReport, (ir) => ir.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'incident_report_id' })
  incidentReport: IncidentReport;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  constructor(entity: Partial<IncidentReportTeamMembers>) {
    super(entity);
    Object.assign(this, entity);
  }
}
