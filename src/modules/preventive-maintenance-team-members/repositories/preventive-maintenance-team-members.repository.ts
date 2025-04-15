import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { PreventiveMaintenanceTeamMembers } from '../entities/preventive-maintenance-team-members.entity';

@Injectable()
export class PreventiveMaintenanceTeamMembersRepository extends BaseRepository<PreventiveMaintenanceTeamMembers> {
  constructor(private dataSource: DataSource) {
    super(PreventiveMaintenanceTeamMembers, dataSource);
  }
}
