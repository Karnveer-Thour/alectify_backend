import { Injectable } from '@nestjs/common';
import { MasterPreventiveMaintenanceAssignees } from 'modules/preventive-maintenance-assignees/entities/master-preventive-maintenance-assignees.entity';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { PreventiveMaintenanceAssignees } from '../../preventive-maintenance-assignees/entities/preventive-maintenance-assignees.entity';
import { User } from '../../users/entities/user.entity';
import { MasterPreventiveMaintenances } from '../entities/master-preventive-maintenances.entity';

@Injectable()
export class MasterPreventiveMaintenancesRepository extends BaseRepository<MasterPreventiveMaintenances> {
  constructor(private dataSource: DataSource) {
    super(MasterPreventiveMaintenances, dataSource);
  }

  async findAllRecurringMasterPms(): Promise<MasterPreventiveMaintenances[]> {
    try {
      return await this.createQueryBuilder('pm')
        .leftJoinAndMapMany(
          'pm.assignees',
          MasterPreventiveMaintenanceAssignees,
          'assignees',
          'assignees.master_preventive_maintenance_id = pm.id',
        )
        .leftJoinAndMapOne(
          'assignees.user',
          User,
          'user',
          'user.id = assignees.user_id',
        )
        .where('pm.isRecurring = true')
        .getMany();
    } catch (error) {
      throw error;
    }
  }
}
