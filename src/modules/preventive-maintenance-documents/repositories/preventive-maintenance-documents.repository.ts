import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { PreventiveMaintenanceDocuments } from '../entities/preventive-maintenance-documents.entity';

@Injectable()
export class PreventiveMaintenanceDocumentsRepository extends BaseRepository<PreventiveMaintenanceDocuments> {
  constructor(private dataSource: DataSource) {
    super(PreventiveMaintenanceDocuments, dataSource);
  }
}
