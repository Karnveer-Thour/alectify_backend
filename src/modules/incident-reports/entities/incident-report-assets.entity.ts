import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Asset } from 'modules/assets/entities/asset.entity';
import { IncidentReport } from './incident-report.entity';

@Entity('incident_report_assets')
@Index(['incidentReport', 'asset'])
export class IncidentReportAsset extends BaseEntity<IncidentReportAsset> {
  @ManyToOne(() => IncidentReport, (incidentReport) => incidentReport.assets, {
    nullable: false,
  })
  @JoinColumn({ name: 'incident_report_id' })
  incidentReport: IncidentReport;

  @ManyToOne(() => Asset, (asset) => asset.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  constructor(entity: Partial<IncidentReportAsset>) {
    super(entity);
    Object.assign(this, entity);
  }
}
