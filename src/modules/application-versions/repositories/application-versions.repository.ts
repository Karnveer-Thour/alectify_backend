import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApplicationVersion } from '../entities/application-version.entity';

@Injectable()
export class ApplicationVersionsRepository extends BaseRepository<ApplicationVersion> {
  constructor(private dataSource: DataSource) {
    super(ApplicationVersion, dataSource);
  }
}
