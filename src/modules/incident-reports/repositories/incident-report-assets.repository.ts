import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IncidentReportAsset } from '../entities/incident-report-assets.entity';

@Injectable()
export class IncidentReportAssetsRepository extends BaseRepository<IncidentReportAsset> {
  constructor(private dataSource: DataSource) {
    super(IncidentReportAsset, dataSource);
  }
}
