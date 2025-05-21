import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ContractManagementDocument } from '../entities/contract-management-document.entity';

@Injectable()
export class ContractManagementDocumentRepository extends BaseRepository<ContractManagementDocument> {
  constructor(private readonly dataSource: DataSource) {
    super(ContractManagementDocument, dataSource);
  }
}
