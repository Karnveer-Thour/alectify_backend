import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProjectIncidentImpact } from '../entities/project-incident-impact.entity';

@Injectable()
export class ProjectIncidentImpactRepository extends BaseRepository<ProjectIncidentImpact> {
  constructor(private dataSource: DataSource) {
    super(ProjectIncidentImpact, dataSource);
  }
  async findAllByProject(projectId: string) {
    return this.find({ where: { project: { id: projectId } } });
  }
}
