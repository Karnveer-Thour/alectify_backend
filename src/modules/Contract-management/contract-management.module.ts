import { Module } from '@nestjs/common';
import { ContractManagementService } from './contract-management.service';
import { ContractManagementController } from './contract-management.controller';
import { ContractManagementRepository } from './Repositories/contract-management.repository';

@Module({
  controllers: [ContractManagementController],
  providers: [ContractManagementService,ContractManagementRepository],
})
export class ContractManagementModule {}
