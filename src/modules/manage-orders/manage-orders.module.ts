import { Module, forwardRef } from '@nestjs/common';
import { ManageOrdersService } from './manage-orders.service';
import { ManageOrdersController } from './manage-orders.controller';
import { ManageOrdersRepository } from './repositories/manage-orders.repository';
import { SparePartsModule } from 'modules/spare-parts/spare-parts.module';
import { ManageOrdersHistoriesRepository } from './repositories/manage-orders-histories.repository';
import { ManageOrdersViewRepository } from './repositories/manage-orders-view.repository';
import { ProjectsModule } from 'modules/projects/projects.module';
import { AssetsModule } from 'modules/assets/assets.module';
import { UsersModule } from 'modules/users/users.module';
import { AreasModule } from 'modules/areas/areas.module';
import { PreventiveMaintenancesModule } from 'modules/preventive-maintenances/preventive-maintenances.module';

@Module({
  imports: [
    forwardRef(() => SparePartsModule),
    ProjectsModule,
    AssetsModule,
    AreasModule,
    UsersModule,
    forwardRef(() => PreventiveMaintenancesModule),
  ],
  controllers: [ManageOrdersController],
  providers: [
    ManageOrdersRepository,
    ManageOrdersHistoriesRepository,
    ManageOrdersViewRepository,
    ManageOrdersService,
  ],
  exports: [ManageOrdersService],
})
export class ManageOrdersModule {}
