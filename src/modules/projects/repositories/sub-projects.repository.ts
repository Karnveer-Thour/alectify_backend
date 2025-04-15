import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SubProject } from '../entities/sub-project.entity';

@Injectable()
export class SubProjectsRepository extends BaseRepository<SubProject> {
  constructor(private dataSource: DataSource) {
    super(SubProject, dataSource);
  }
}
