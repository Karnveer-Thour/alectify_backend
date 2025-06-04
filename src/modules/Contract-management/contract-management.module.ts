import { Module } from '@nestjs/common';
import { ContractManagementService } from './contract-management.service';
import { ContractManagementController } from './contract-management.controller';
import { ContractManagementRepository } from './Repositories/contract-management.repository';
import { OrganizationsModule } from 'modules/organizations/organizations.module';
import { UsersModule } from 'modules/users/users.module';
import { ContractManagementDocumentRepository } from './Repositories/contract-management-document.entity';
import { FilesUploadModule } from 'modules/files-upload/files-upload.module';
import { ProjectsRepository } from 'modules/projects/repositories/projects.repository';
import { ProjectsModule } from 'modules/projects/projects.module';
import { UsersRepository } from 'modules/users/repositories/users.repository';
import { ContractManagementDocumentService } from './contract-management-document.service';
import { BullModule } from '@nestjs/bull';
import { contractManagementDocumentsConsumer } from './consumers/contract-management-documents.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'contractManagementDocuments',
      defaultJobOptions: {
          removeOnComplete: true,
        },
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
    ContractManagementDocumentRepository,
    ContractManagementRepository,
    ProjectsRepository,
    UsersRepository,
    contractManagementDocumentsConsumer,
  ],
})
export class ContractManagementModule {}
