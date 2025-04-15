import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DocumentsView } from '../entities/documents-view.entity';

@Injectable()
export class DocumentsViewRepository extends BaseRepository<DocumentsView> {
  constructor(private dataSource: DataSource) {
    super(DocumentsView, dataSource);
  }
}
