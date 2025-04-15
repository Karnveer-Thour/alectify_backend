import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Documents } from '../entities/documents.entity';

@Injectable()
export class DocumentsRepository extends BaseRepository<Documents> {
  constructor(private dataSource: DataSource) {
    super(Documents, dataSource);
  }
}
