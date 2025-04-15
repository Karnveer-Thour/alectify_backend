import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IncidentReportComment } from './incident-report-comment.entity';

@Entity('incident_report_comment_files')
export class IncidentReportCommentFile extends BaseEntity<IncidentReportCommentFile> {
  @ManyToOne(() => IncidentReportComment, (irc) => irc.files, {
    nullable: false,
  })
  @JoinColumn({ name: 'incident_report_id' })
  incidentReportComment: IncidentReportComment;

  @Column({ name: 'file_name', type: 'varchar', nullable: false })
  fileName: string;

  @Column({ name: 'file_path', type: 'text', nullable: false })
  filePath: string;

  @Column({ name: 'file_type', type: 'varchar', nullable: false })
  fileType: string;

  @Column({ name: 'is_active', type: 'bool', nullable: false, default: true })
  isActive: boolean;

  constructor(entity: Partial<IncidentReportCommentFile>) {
    super(entity);
    Object.assign(this, entity);
  }
}
