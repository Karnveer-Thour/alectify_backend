import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectsRepository extends BaseRepository<Project> {
  constructor(private dataSource: DataSource) {
    super(Project, dataSource);
  }
}
