import { Module } from '@nestjs/common';
import { ContractManagementService } from './contract-management.service';
import { ContractManagementController } from './contract-management.controller';
import { ContractManagementRepository } from './Repositories/contract-management.repository';
import { OrganizationsModule } from 'modules/organizations/organizations.module';
import { UsersModule } from 'modules/users/users.module';

@Module({
  imports:[OrganizationsModule,UsersModule],
  controllers: [ContractManagementController],
  providers: [ContractManagementService,ContractManagementRepository],
})
export class ContractManagementModule {}
