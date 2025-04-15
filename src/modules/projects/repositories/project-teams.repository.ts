import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProjectTeams } from '../entities/project-teams.entity';

@Injectable()
export class ProjectTeamsRepository extends BaseRepository<ProjectTeams> {
  constructor(private dataSource: DataSource) {
    super(ProjectTeams, dataSource);
  }
}
