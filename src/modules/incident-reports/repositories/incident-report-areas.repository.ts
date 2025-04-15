import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IncidentReportArea } from '../entities/incident-report-areas.entity';

@Injectable()
export class IncidentReportAreasRepository extends BaseRepository<IncidentReportArea> {
  constructor(private dataSource: DataSource) {
    super(IncidentReportArea, dataSource);
  }
}
