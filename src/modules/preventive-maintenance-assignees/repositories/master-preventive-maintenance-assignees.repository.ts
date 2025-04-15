import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { MasterPreventiveMaintenanceAssignees } from '../entities/master-preventive-maintenance-assignees.entity';

@Injectable()
export class MasterPreventiveMaintenanceAssigneesRepository extends BaseRepository<MasterPreventiveMaintenanceAssignees> {
  constructor(private dataSource: DataSource) {
    super(MasterPreventiveMaintenanceAssignees, dataSource);
  }
}
