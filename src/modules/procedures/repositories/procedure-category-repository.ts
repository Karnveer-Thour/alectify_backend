import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProcedureCategories } from '../entities/procedure-category-entity';

@Injectable()
export class ProcedureCategoriesRepository extends BaseRepository<ProcedureCategories> {
  constructor(private dataSource: DataSource) {
    super(ProcedureCategories, dataSource);
  }
}
