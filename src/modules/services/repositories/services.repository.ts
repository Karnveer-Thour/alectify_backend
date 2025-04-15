import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Services } from '../entities/service.entity';

@Injectable()
export class ServicesRepository extends BaseRepository<Services> {
  constructor(private dataSource: DataSource) {
    super(Services, dataSource);
  }
}
