import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProcedureSteps } from '../entities/procedure-steps-entity';

@Injectable()
export class ProcedureStepsRepository extends BaseRepository<ProcedureSteps> {
  constructor(private dataSource: DataSource) {
    super(ProcedureSteps, dataSource);
  }
}
