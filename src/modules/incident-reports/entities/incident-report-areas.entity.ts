import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Area } from 'modules/areas/entities/area.entity';
import { IncidentReport } from './incident-report.entity';

@Entity('incident_report_areas')
@Index(['incidentReport', 'area'])
export class IncidentReportArea extends BaseEntity<IncidentReportArea> {
  @ManyToOne(() => IncidentReport, (incidentReport) => incidentReport.areas, {
    nullable: false,
  })
  @JoinColumn({ name: 'incident_report_id' })
  incidentReport: IncidentReport;

  @ManyToOne(() => Area, (area) => area.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  constructor(entity: Partial<IncidentReportArea>) {
    super(entity);
    Object.assign(this, entity);
  }
}
