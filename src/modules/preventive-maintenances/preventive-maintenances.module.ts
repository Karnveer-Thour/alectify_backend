import { forwardRef, Module } from '@nestjs/common';
import { PreventiveMaintenancesController } from './preventive-maintenances.controller';
import { PreventiveMaintenancesService } from './preventive-maintenances.service';
import { PreventiveMaintenancesRepository } from './repositories/preventive-maintenances.repository';
import { BullModule } from '@nestjs/bull';
import { HttpWrapperModule } from '@common/http-wrapper/http-wrapper.module';
import { SendGridModule } from '@core/sendgrid/sendgrid.module';
import { OperationApisModule } from '../operation-apis/operation-apis.module';
import { PreventiveMaintenanceAssigneesModule } from '../preventive-maintenance-assignees/preventive-maintenance-assignees.module';
import { UsersModule } from '../users/users.module';
import { MasterPreventiveMaintenancesRepository } from './repositories/master-preventive-maintenances.repository';
import { PreventiveMaintenanceDocumentsModule } from 'modules/preventive-maintenance-documents/preventive-maintenance-documents.module';
import { ProjectsModule } from 'modules/projects/projects.module';
import { AssetsModule } from 'modules/assets/assets.module';
import { AreasModule } from 'modules/areas/areas.module';
import { OrganizationsModule } from 'modules/organizations/organizations.module';
import { FrontendConfig } from '@core/frontend-configs/frontend-configs.config';
import { ConfigModule } from '@nestjs/config';
import { ProceduresModule } from 'modules/procedures/procedures.module';
import { CommentsModule } from 'modules/comments/comments.module';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { PreventiveMaintenancesConsumer } from './consumers/preventive-maintenances.consumer';
import { PreventiveMaintenanceApproversModule } from 'modules/preventive-maintenance-approvers/preventive-maintenance-approvers.module';
import { FilesUploadModule } from 'modules/files-upload/files-upload.module';
import { DocumentsModule } from 'modules/documents/documents.module';
import { ManageOrdersModule } from 'modules/manage-orders/manage-orders.module';
import { PreventiveMaintenanceTeamMembersModule } from 'modules/preventive-maintenance-team-members/preventive-maintenance-team-members.module';
import { AIModule } from 'modules/ai/ai.module';
import { PreventiveMaintenanceGptConsumer } from './consumers/preventive-maintenances-gpt.consumer';
import { PreventiveMaintenanceAssetsModule } from 'modules/preventive-maintenance-assets/preventive-maintenance-assets.module';
import { PreventiveMaintenanceAreasModule } from 'modules/preventive-maintenance-areas/preventive-maintenance-areas.module';
import { MasterPreventiveMaintenanceService } from './master-preventive-maintenance.service';
import { MasterPreventiveMaintenanceController } from './master-preventive-maintenance.controller';
import { MasterPreventiveMaintenanceDocumentsModule } from 'modules/master-preventive-maintenance-documents/master-preventive-maintenance-documents.module';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'preventiveMaintenances',
        defaultJobOptions: {
          removeOnComplete: true,
        },
      },
      {
        name: 'preventiveMaintenanceGpt',
        defaultJobOptions: {
          removeOnComplete: true,
        },
      },
    ),
    ConfigModule.forFeature(FrontendConfig),
    OperationApisModule,
    HttpWrapperModule,
    UsersModule,
    forwardRef(() => DocumentsModule),
    forwardRef(() => PreventiveMaintenanceDocumentsModule),
    forwardRef(() => PreventiveMaintenanceAssigneesModule),
    PreventiveMaintenanceApproversModule,
    PreventiveMaintenanceTeamMembersModule,
    ProjectsModule,
    AssetsModule,
    AreasModule,
    OrganizationsModule,
    SendGridModule,
    ProceduresModule,
    FilesUploadModule,
    CommentsModule,
    ManageOrdersModule,
    forwardRef(() => NotificationsModule),
    AIModule,
    PreventiveMaintenanceAssetsModule,
    PreventiveMaintenanceAreasModule,
    MasterPreventiveMaintenanceDocumentsModule,
  ],
  controllers: [
    PreventiveMaintenancesController,
    MasterPreventiveMaintenanceController,
  ],
  providers: [
    PreventiveMaintenancesService,
    PreventiveMaintenancesRepository,
    MasterPreventiveMaintenanceService,
    MasterPreventiveMaintenancesRepository,
    PreventiveMaintenancesConsumer,
    PreventiveMaintenanceGptConsumer,
  ],
  exports: [PreventiveMaintenancesService],
})
export class PreventiveMaintenancesModule {}
