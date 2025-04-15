import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { PreventiveMaintenanceApprovers } from '../entities/preventive-maintenance-approvers.entity';

@Injectable()
export class PreventiveMaintenanceApproversRepository extends BaseRepository<PreventiveMaintenanceApprovers> {
  constructor(private dataSource: DataSource) {
    super(PreventiveMaintenanceApprovers, dataSource);
  }
}
