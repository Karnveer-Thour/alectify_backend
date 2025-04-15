import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TimelinesView } from '../entities/timelines-view.entity';

@Injectable()
export class TimelinesViewRepository extends BaseRepository<TimelinesView> {
  constructor(private dataSource: DataSource) {
    super(TimelinesView, dataSource);
  }
}
