import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { IncidentReportTeamMembers } from '../entities/incident-report-team-members.entity';

@Injectable()
export class IncidentReportTeamMembersRepository extends BaseRepository<IncidentReportTeamMembers> {
  constructor(private dataSource: DataSource) {
    super(IncidentReportTeamMembers, dataSource);
  }
}
