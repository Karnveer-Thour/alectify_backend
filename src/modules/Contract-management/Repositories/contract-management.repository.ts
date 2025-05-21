import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { ContractManagement } from '../entities/contract-management.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ContractManagementRepository extends BaseRepository<ContractManagement> {
  constructor(private readonly dataSource: DataSource) {
    super(ContractManagement, dataSource);
  }
}
