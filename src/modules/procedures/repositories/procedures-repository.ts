import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Procedures } from '../entities/procedures-entity';

@Injectable()
export class ProceduresRepository extends BaseRepository<Procedures> {
  constructor(private dataSource: DataSource) {
    super(Procedures, dataSource);
  }
}
