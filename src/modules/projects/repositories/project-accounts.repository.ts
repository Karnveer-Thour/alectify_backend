import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProjectAccount } from '../entities/project-account.entity';

@Injectable()
export class ProjectAccountsRepository extends BaseRepository<ProjectAccount> {
  constructor(private dataSource: DataSource) {
    super(ProjectAccount, dataSource);
  }
}
