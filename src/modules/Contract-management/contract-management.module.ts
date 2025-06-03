import { Module } from '@nestjs/common';
import { ContractManagementService } from './contract-management.service';
import { ContractManagementController } from './contract-management.controller';
import { ContractManagementRepository } from './Repositories/contract-management.repository';
import { OrganizationsModule } from 'modules/organizations/organizations.module';
import { UsersModule } from 'modules/users/users.module';
import { ContractManagementDocumentRepository } from './Repositories/contract-management-document.entity';
import { FilesUploadModule } from 'modules/files-upload/files-upload.module';
import { ProjectsService } from 'modules/projects/projects.service';
import { ProjectsRepository } from 'modules/projects/repositories/projects.repository';
import { ProjectsModule } from 'modules/projects/projects.module';
import { UsersRepository } from 'modules/users/repositories/users.repository';
import { ContractManagementDocumentService } from './contract-management-document.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
     BullModule.registerQueue({
      name: 'contractManagementDocuments',
    }),
    OrganizationsModule,
    UsersModule,
    FilesUploadModule,
    ProjectsModule,
  ],
  controllers: [ContractManagementController],
  providers: [
    ContractManagementService,
    ContractManagementDocumentService,
    ContractManagementRepository,
    ContractManagementDocumentRepository,
    ProjectsRepository,
    UsersRepository,
  ],
})
export class ContractManagementModule {}
