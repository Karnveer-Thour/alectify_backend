import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { MasterPreventiveMaintenanceTeamMembers } from '../entities/master-preventive-maintenance-team-members.entity';

@Injectable()
export class MasterPreventiveMaintenanceTeamMembersRepository extends BaseRepository<MasterPreventiveMaintenanceTeamMembers> {
  constructor(private dataSource: DataSource) {
    super(MasterPreventiveMaintenanceTeamMembers, dataSource);
  }
}
