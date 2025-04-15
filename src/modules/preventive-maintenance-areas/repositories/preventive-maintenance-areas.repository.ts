import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { PreventiveMaintenanceAreas } from '../entities/preventive-maintenance-areas.entity';

@Injectable()
export class PreventiveMaintenanceAreasRepository extends BaseRepository<PreventiveMaintenanceAreas> {
  constructor(private dataSource: DataSource) {
    super(PreventiveMaintenanceAreas, dataSource);
  }
}
