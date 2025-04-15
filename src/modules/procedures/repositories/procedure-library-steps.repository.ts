import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProcedureLibrarySteps } from '../entities/procedure-library-steps-entity';

@Injectable()
export class ProcedureLibraryStepsRepository extends BaseRepository<ProcedureLibrarySteps> {
  constructor(private dataSource: DataSource) {
    super(ProcedureLibrarySteps, dataSource);
  }
}
