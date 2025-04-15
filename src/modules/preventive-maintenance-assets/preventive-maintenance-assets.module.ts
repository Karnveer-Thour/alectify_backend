import { forwardRef, Module } from '@nestjs/common';
import { PreventiveMaintenancesModule } from '../preventive-maintenances/preventive-maintenances.module';
import { PreventiveMaintenanceAssetsService } from './preventive-maintenance-assets.service';
import { MasterPreventiveMaintenanceAssetsRepository } from './repositories/master-preventive-maintenance-assets.repository';
import { PreventiveMaintenanceAssetsRepository } from './repositories/preventive-maintenance-assets.repository';
import { AssetsModule } from 'modules/assets/assets.module';
import { PreventiveMaintenanceAssetsController } from './preventive-maintenance-assets.controller';

@Module({
  imports: [AssetsModule, forwardRef(() => PreventiveMaintenancesModule)],
  controllers: [PreventiveMaintenanceAssetsController],
  providers: [
    PreventiveMaintenanceAssetsService,
    PreventiveMaintenanceAssetsRepository,
    MasterPreventiveMaintenanceAssetsRepository,
  ],
  exports: [PreventiveMaintenanceAssetsService],
})
export class PreventiveMaintenanceAssetsModule {}
