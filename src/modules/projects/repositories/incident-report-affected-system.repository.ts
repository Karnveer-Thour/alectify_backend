import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProjectAffectedSystem } from '../entities/project-affected-system.entity';

@Injectable()
export class ProjectAffectedSystemRepository extends BaseRepository<ProjectAffectedSystem> {
  constructor(private dataSource: DataSource) {
    super(ProjectAffectedSystem, dataSource);
  }

  async findAllByProject(projectId: string) {
    return this.find({ where: { project: { id: projectId } } });
  }
}
