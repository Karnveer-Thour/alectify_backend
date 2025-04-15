import { Module, forwardRef } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { AssetsRepository } from './repositories/assets.repository';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from 'modules/users/users.module';
import { PreventiveMaintenancesModule } from 'modules/preventive-maintenances/preventive-maintenances.module';
import { FilesUploadModule } from 'modules/files-upload/files-upload.module';
import { AreasModule } from 'modules/areas/areas.module';

@Module({
  imports: [
    ProjectsModule,
    UsersModule,
    FilesUploadModule,
    forwardRef(() => PreventiveMaintenancesModule),
    AreasModule,
  ],
  controllers: [AssetsController],
  providers: [AssetsService, AssetsRepository],
  exports: [AssetsService],
})
export class AssetsModule {}
