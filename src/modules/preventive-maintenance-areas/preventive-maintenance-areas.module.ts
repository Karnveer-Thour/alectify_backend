import { forwardRef, Module } from '@nestjs/common';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { UserFcmToken } from 'modules/users/entities/user-fcm-token.entity';
import { PreventiveMaintenancesModule } from '../preventive-maintenances/preventive-maintenances.module';
import { PreventiveMaintenanceAreasController } from './preventive-maintenance-areas.controller';
import { PreventiveMaintenanceAreasService } from './preventive-maintenance-areas.service';
import { MasterPreventiveMaintenanceAreasRepository } from './repositories/master-preventive-maintenance-areas.repository';
import { PreventiveMaintenanceAreasRepository } from './repositories/preventive-maintenance-areas.repository';
import { AreasModule } from 'modules/areas/areas.module';

@Module({
  imports: [AreasModule, forwardRef(() => PreventiveMaintenancesModule)],
  controllers: [PreventiveMaintenanceAreasController],
  providers: [
    PreventiveMaintenanceAreasService,
    PreventiveMaintenanceAreasRepository,
    MasterPreventiveMaintenanceAreasRepository,
  ],
  exports: [PreventiveMaintenanceAreasService],
})
export class PreventiveMaintenanceAreasModule {}
