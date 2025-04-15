import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PreventiveMaintenancesModule } from '../preventive-maintenances/preventive-maintenances.module';
import { CronSchedulesService } from './cron-schedules.service';
import { AreasModule } from 'modules/areas/areas.module';
import { AssetsModule } from 'modules/assets/assets.module';
import { SendGridModule } from '@core/sendgrid/sendgrid.module';
import { RemindersCronService } from './reminders-cron.service';
import { FrontendConfig } from '@core/frontend-configs/frontend-configs.config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'modules/users/users.module';
import { DailyEmailCronService } from './daily-email-cron.service';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { ProjectsModule } from 'modules/projects/projects.module';
import { PmAutoOpenCronService } from './pm-auto-open-cron.service';
import { PreventiveMaintenanceTeamMembersModule } from 'modules/preventive-maintenance-team-members/preventive-maintenance-team-members.module';

import { MasterPreventiveMaintenancesRepository } from 'modules/preventive-maintenances/repositories/master-preventive-maintenances.repository';
import { PreventiveMaintenancesRepository } from 'modules/preventive-maintenances/repositories/preventive-maintenances.repository';
import { MasterPreventiveMaintenanceAssetsRepository } from 'modules/preventive-maintenance-assets/repositories/master-preventive-maintenance-assets.repository';
import { MasterPreventiveMaintenanceAreasRepository } from 'modules/preventive-maintenance-areas/repositories/master-preventive-maintenance-areas.repository';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forFeature(FrontendConfig),
    PreventiveMaintenancesModule,
    NotificationsModule,
    UsersModule,
    SendGridModule,
    ProjectsModule,
    PreventiveMaintenanceTeamMembersModule,
  ],
  providers: [
    RemindersCronService,
    CronSchedulesService,
    DailyEmailCronService,
    PmAutoOpenCronService,
    PreventiveMaintenancesRepository,
    MasterPreventiveMaintenancesRepository,
    MasterPreventiveMaintenanceAssetsRepository,
    MasterPreventiveMaintenanceAreasRepository,
  ],
})
export class CronSchedulesModule {}
