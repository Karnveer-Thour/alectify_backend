import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IncidentReportComment } from '../entities/incident-report-comment.entity';
import { BaseRepository } from '@common/repositories/base.repository';

@Injectable()
export class IncidentReportCommentsRepository extends BaseRepository<IncidentReportComment> {
  constructor(private dataSource: DataSource) {
    super(IncidentReportComment, dataSource);
  }
}
