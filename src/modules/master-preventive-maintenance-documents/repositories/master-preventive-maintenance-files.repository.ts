import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { MasterPreventiveMaintenanceFiles } from '../entities/master-preventive-maintenance-files.entity';

@Injectable()
export class MasterPreventiveMaintenanceFilesRepository extends BaseRepository<MasterPreventiveMaintenanceFiles> {
  constructor(private dataSource: DataSource) {
    super(MasterPreventiveMaintenanceFiles, dataSource);
  }
}
