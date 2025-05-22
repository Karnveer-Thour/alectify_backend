import { Module } from '@nestjs/common';
import { ContractManagementService } from './contract-management.service';
import { ContractManagementController } from './contract-management.controller';
import { ContractManagementRepository } from './Repositories/contract-management.repository';
import { OrganizationsModule } from 'modules/organizations/organizations.module';
import { UsersModule } from 'modules/users/users.module';
import { ContractManagementDocumentRepository } from './Repositories/contract-management-document.entity';
import { FilesUploadModule } from 'modules/files-upload/files-upload.module';

@Module({
  imports: [OrganizationsModule, UsersModule,FilesUploadModule,],
  controllers: [ContractManagementController],
  providers: [
    ContractManagementService,
    ContractManagementRepository,
    ContractManagementDocumentRepository,
  ],
})
export class ContractManagementModule {}
