import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from 'modules/users/entities/user.entity';
import { IncidentReport } from './incident-report.entity';

@Entity('incident_reports_documents')
export class IncidentReportDocument extends BaseEntity<IncidentReportDocument> {
  @ManyToOne(() => IncidentReport, (ir) => ir.documents, {
    nullable: false,
  })
  @JoinColumn({ name: 'incident_report_id' })
  incidentReport: IncidentReport;

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

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: User;

  constructor(entity: Partial<IncidentReportDocument>) {
    super(entity);
    Object.assign(this, entity);
  }
}
