import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { MasterPreventiveMaintenanceAreas } from '../entities/master-preventive-maintenance-areas.entity';

@Injectable()
export class MasterPreventiveMaintenanceAreasRepository extends BaseRepository<MasterPreventiveMaintenanceAreas> {
  constructor(private dataSource: DataSource) {
    super(MasterPreventiveMaintenanceAreas, dataSource);
  }
}
