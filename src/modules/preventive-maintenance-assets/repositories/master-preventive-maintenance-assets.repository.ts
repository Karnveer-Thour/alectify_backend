import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { MasterPreventiveMaintenanceAssets } from '../entities/master-preventive-maintenance-assets.entity';

@Injectable()
export class MasterPreventiveMaintenanceAssetsRepository extends BaseRepository<MasterPreventiveMaintenanceAssets> {
  constructor(private dataSource: DataSource) {
    super(MasterPreventiveMaintenanceAssets, dataSource);
  }
}
