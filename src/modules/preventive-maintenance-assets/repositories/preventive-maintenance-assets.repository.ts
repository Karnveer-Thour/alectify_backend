import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { PreventiveMaintenanceAssets } from '../entities/preventive-maintenance-assets.entity';

@Injectable()
export class PreventiveMaintenanceAssetsRepository extends BaseRepository<PreventiveMaintenanceAssets> {
  constructor(private dataSource: DataSource) {
    super(PreventiveMaintenanceAssets, dataSource);
  }
}
