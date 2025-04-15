import { forwardRef, Module } from '@nestjs/common';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { UserFcmToken } from 'modules/users/entities/user-fcm-token.entity';
import { PreventiveMaintenancesModule } from '../preventive-maintenances/preventive-maintenances.module';
import { UsersModule } from '../users/users.module';
import { PreventiveMaintenanceTeamMembersController } from './preventive-maintenance-team-members.controller';
import { PreventiveMaintenanceTeamMembersService } from './preventive-maintenance-team-members.service';
import { MasterPreventiveMaintenanceTeamMembersRepository } from './repositories/master-preventive-maintenance-team-members.repository';
import { PreventiveMaintenanceTeamMembersRepository } from './repositories/preventive-maintenance-team-members.repository';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => PreventiveMaintenancesModule),
    UserFcmToken,
    NotificationsModule,
  ],
  controllers: [PreventiveMaintenanceTeamMembersController],
  providers: [
    PreventiveMaintenanceTeamMembersService,
    MasterPreventiveMaintenanceTeamMembersRepository,
    PreventiveMaintenanceTeamMembersRepository,
  ],
  exports: [PreventiveMaintenanceTeamMembersService],
})
export class PreventiveMaintenanceTeamMembersModule {}
