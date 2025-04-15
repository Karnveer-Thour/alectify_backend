import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Area } from '../entities/area.entity';

@Injectable()
export class AreasRepository extends BaseRepository<Area> {
  constructor(private dataSource: DataSource) {
    super(Area, dataSource);
  }
}
