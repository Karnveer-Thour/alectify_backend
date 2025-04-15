import { forwardRef, Module } from '@nestjs/common';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { UserFcmToken } from 'modules/users/entities/user-fcm-token.entity';
import { PreventiveMaintenancesModule } from '../preventive-maintenances/preventive-maintenances.module';
import { UsersModule } from '../users/users.module';
import { PreventiveMaintenanceAssigneesController } from './preventive-maintenance-assignees.controller';
import { PreventiveMaintenanceAssigneesService } from './preventive-maintenance-assignees.service';
import { MasterPreventiveMaintenanceAssigneesRepository } from './repositories/master-preventive-maintenance-assignees.repository';
import { PreventiveMaintenanceAssigneesRepository } from './repositories/preventive-maintenance-assignees.repository';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => PreventiveMaintenancesModule),
    UserFcmToken,
    NotificationsModule,
  ],
  controllers: [PreventiveMaintenanceAssigneesController],
  providers: [
    PreventiveMaintenanceAssigneesService,
    PreventiveMaintenanceAssigneesRepository,
    MasterPreventiveMaintenanceAssigneesRepository,
  ],
  exports: [PreventiveMaintenanceAssigneesService],
})
export class PreventiveMaintenanceAssigneesModule {}
