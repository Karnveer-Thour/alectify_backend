import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { CoreModule } from './core/core.module';
import { CronSchedulesModule } from './modules/cron-schedules/cron-schedules.module';
import { FilesUploadModule } from './modules/files-upload/files-upload.module';
import { ManageOrdersModule } from './modules/manage-orders/manage-orders.module';
import { PreventiveMaintenanceAssigneesModule } from './modules/preventive-maintenance-assignees/preventive-maintenance-assignees.module';
import { PreventiveMaintenanceDocumentsModule } from './modules/preventive-maintenance-documents/preventive-maintenance-documents.module';
import { PreventiveMaintenancesModule } from './modules/preventive-maintenances/preventive-maintenances.module';
import { SparePartCategoriesModule } from './modules/spare-part-categories/spare-part-categories.module';
import { SparePartsModule } from './modules/spare-parts/spare-parts.module';
import { JwtAuthGuard } from './modules/users/guards/jwt.guard';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AssetsModule } from './modules/assets/assets.module';
import { AreasModule } from './modules/areas/areas.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ServicesModule } from './modules/services/services.module';
import { ProceduresModule } from 'modules/procedures/procedures.module';
import { CommentsModule } from 'modules/comments/comments.module';
import { TimelinesModule } from 'modules/timelines/timelines.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BullModule } from '@nestjs/bull';
import { ApplicationVersionsModule } from 'modules/application-versions/application-versions.module';
import { DocumentsModule } from 'modules/documents/documents.module';
import { PreventiveMaintenanceTeamMembersModule } from 'modules/preventive-maintenance-team-members/preventive-maintenance-team-members.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { IncidentReportsModule } from 'modules/incident-reports/incident-reports.module';
import { IncidentReportTeamMembersModule } from 'modules/incident-report-team-members/incident-report-team-members.module';
import { AIModule } from 'modules/ai/ai.module';
import { IncidentReportCommentsModule } from 'modules/incident-report-comments/incident-report-comments.module';
import { ContractManagementModule } from 'modules/Contract-management/contract-management.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      // Use the Redis store
      store: redisStore as unknown as CacheStore, // Force the type to match
      host: process.env.REDIS_HOST || 'localhost',
      port: +process.env.REDIS_PORT || 6379,
      ttl: 5, // Default Time-To-Live (seconds)
      // If your Redis instance requires auth or other options, include them here.
      // auth_pass: 'your_redis_password',
    }),
    CoreModule,
    UsersModule,
    PreventiveMaintenancesModule,
    PreventiveMaintenanceAssigneesModule,
    PreventiveMaintenanceDocumentsModule,
    FilesUploadModule,
    CronSchedulesModule,
    SparePartsModule,
    SparePartCategoriesModule,
    ManageOrdersModule,
    ProjectsModule,
    AssetsModule,
    AreasModule,
    OrganizationsModule,
    ServicesModule,
    ProceduresModule,
    CommentsModule,
    TimelinesModule,
    NotificationsModule,
    ApplicationVersionsModule,
    DocumentsModule,
    PreventiveMaintenanceTeamMembersModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: +process.env.REDIS_PORT || 6379,
      },
    }),
    DashboardModule,
    IncidentReportsModule,
    IncidentReportTeamMembersModule,
    IncidentReportCommentsModule,
    AIModule,
    ContractManagementModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
