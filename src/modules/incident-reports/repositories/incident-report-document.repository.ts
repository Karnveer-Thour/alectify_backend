import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IncidentReportDocument } from '../entities/incident-report-document.entity';

@Injectable()
export class IncidentReportDocumentRepository extends BaseRepository<IncidentReportDocument> {
  constructor(private dataSource: DataSource) {
    super(IncidentReportDocument, dataSource);
  }
}
