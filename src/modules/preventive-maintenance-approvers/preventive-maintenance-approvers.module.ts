import { forwardRef, Module } from '@nestjs/common';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { UserFcmToken } from 'modules/users/entities/user-fcm-token.entity';
import { PreventiveMaintenancesModule } from '../preventive-maintenances/preventive-maintenances.module';
import { UsersModule } from '../users/users.module';
import { PreventiveMaintenanceApproversController } from './preventive-maintenance-approvers.controller';
import { PreventiveMaintenanceApproversService } from './preventive-maintenance-approvers.service';
import { MasterPreventiveMaintenanceApproversRepository } from './repositories/master-preventive-maintenance-approvers.repository';
import { PreventiveMaintenanceApproversRepository } from './repositories/preventive-maintenance-approvers.repository';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => PreventiveMaintenancesModule),
    UserFcmToken,
    NotificationsModule,
  ],
  controllers: [PreventiveMaintenanceApproversController],
  providers: [
    PreventiveMaintenanceApproversService,
    PreventiveMaintenanceApproversRepository,
    MasterPreventiveMaintenanceApproversRepository,
  ],
  exports: [PreventiveMaintenanceApproversService],
})
export class PreventiveMaintenanceApproversModule {}
