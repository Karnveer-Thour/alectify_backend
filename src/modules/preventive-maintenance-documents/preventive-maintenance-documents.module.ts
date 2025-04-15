import { Module, forwardRef } from '@nestjs/common';
import { PreventiveMaintenancesModule } from '../preventive-maintenances/preventive-maintenances.module';
import { UsersModule } from '../users/users.module';
import { FilesUploadModule } from '../files-upload/files-upload.module';
import { PreventiveMaintenanceDocumentsController } from './preventive-maintenance-documents.controller';
import { PreventiveMaintenanceDocumentsService } from './preventive-maintenance-documents.service';
import { PreventiveMaintenanceDocumentsRepository } from './repositories/preventive-maintenance-documents.repository';
import { ProjectsModule } from 'modules/projects/projects.module';
import { CommentsModule } from 'modules/comments/comments.module';
import { BullModule } from '@nestjs/bull';
import { PreventiveMaintenanceDocumentsConsumer } from './consumers/preventive-maintenance-documents.consumer';
import { AIModule } from 'modules/ai/ai.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'preventiveMaintenanceDocuments',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
    UsersModule,
    FilesUploadModule,
    ProjectsModule,
    CommentsModule,
    forwardRef(() => PreventiveMaintenancesModule),
    AIModule,
  ],
  controllers: [PreventiveMaintenanceDocumentsController],
  providers: [
    PreventiveMaintenanceDocumentsService,
    PreventiveMaintenanceDocumentsRepository,
    PreventiveMaintenanceDocumentsConsumer,
  ],
  exports: [PreventiveMaintenanceDocumentsService],
})
export class PreventiveMaintenanceDocumentsModule {}
