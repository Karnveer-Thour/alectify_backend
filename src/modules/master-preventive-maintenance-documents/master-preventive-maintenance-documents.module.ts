import { Module, forwardRef } from '@nestjs/common';
import { PreventiveMaintenancesModule } from '../preventive-maintenances/preventive-maintenances.module';
import { UsersModule } from '../users/users.module';
import { FilesUploadModule } from '../files-upload/files-upload.module';
import { MasterPreventiveMaintenanceDocumentsController } from './master-preventive-maintenance-documents.controller';
import { MasterPreventiveMaintenanceDocumentsService } from './master-preventive-maintenance-documents.service';
import { MasterPreventiveMaintenanceImagesRepository } from './repositories/master-preventive-maintenance-images.repository';
import { ProjectsModule } from 'modules/projects/projects.module';
import { MasterPreventiveMaintenanceFilesRepository } from './repositories/master-preventive-maintenance-files.repository';
import { PreventiveMaintenanceDocumentsModule } from 'modules/preventive-maintenance-documents/preventive-maintenance-documents.module';
import { BullModule } from '@nestjs/bull';
import { MasterPreventiveMaintenanceDocumentsConsumer } from './consumers/master-preventive-maintenance-documents.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'masterPreventiveMaintenanceDocuments',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
    UsersModule,
    FilesUploadModule,
    ProjectsModule,
    forwardRef(() => PreventiveMaintenancesModule),
    PreventiveMaintenanceDocumentsModule,
  ],
  controllers: [MasterPreventiveMaintenanceDocumentsController],
  providers: [
    MasterPreventiveMaintenanceDocumentsService,
    MasterPreventiveMaintenanceImagesRepository,
    MasterPreventiveMaintenanceFilesRepository,
    MasterPreventiveMaintenanceDocumentsConsumer,
  ],
  exports: [MasterPreventiveMaintenanceDocumentsService],
})
export class MasterPreventiveMaintenanceDocumentsModule {}
