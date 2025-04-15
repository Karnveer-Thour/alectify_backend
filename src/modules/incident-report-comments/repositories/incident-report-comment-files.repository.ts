import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { IncidentReportCommentFile } from '../entities/incident-report-comment-file.entity';

@Injectable()
export class IncidentReportCommentFilesRepository extends BaseRepository<IncidentReportCommentFile> {
  constructor(private dataSource: DataSource) {
    super(IncidentReportCommentFile, dataSource);
  }
}
