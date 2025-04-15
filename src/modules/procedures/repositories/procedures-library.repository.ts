import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProceduresLibrary } from '../entities/procedures-library-entity';

@Injectable()
export class ProceduresLibraryRepository extends BaseRepository<ProceduresLibrary> {
  constructor(private dataSource: DataSource) {
    super(ProceduresLibrary, dataSource);
  }
}
