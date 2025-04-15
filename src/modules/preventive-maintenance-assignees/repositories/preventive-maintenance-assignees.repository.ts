import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { PreventiveMaintenanceAssignees } from '../entities/preventive-maintenance-assignees.entity';

@Injectable()
export class PreventiveMaintenanceAssigneesRepository extends BaseRepository<PreventiveMaintenanceAssignees> {
  constructor(private dataSource: DataSource) {
    super(PreventiveMaintenanceAssignees, dataSource);
  }
}
