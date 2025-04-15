import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProjectTeamMembers } from '../entities/project-team-members.entity';

@Injectable()
export class ProjectTeamMembersRepository extends BaseRepository<ProjectTeamMembers> {
  constructor(private dataSource: DataSource) {
    super(ProjectTeamMembers, dataSource);
  }
}
