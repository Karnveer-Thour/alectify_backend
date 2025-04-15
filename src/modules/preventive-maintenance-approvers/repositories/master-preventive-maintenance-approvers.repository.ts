import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { MasterPreventiveMaintenanceApprovers } from '../entities/master-preventive-maintenance-approvers.entity';

@Injectable()
export class MasterPreventiveMaintenanceApproversRepository extends BaseRepository<MasterPreventiveMaintenanceApprovers> {
  constructor(private dataSource: DataSource) {
    super(MasterPreventiveMaintenanceApprovers, dataSource);
  }
}
