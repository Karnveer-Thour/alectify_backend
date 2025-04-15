import { Module } from '@nestjs/common';
import { AssetsModule } from 'modules/assets/assets.module';
import { DocumentsModule } from 'modules/documents/documents.module';
import { ProceduresModule } from 'modules/procedures/procedures.module';
import { ProjectsModule } from 'modules/projects/projects.module';
import { UsersModule } from 'modules/users/users.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AreasModule } from 'modules/areas/areas.module';

@Module({
  imports: [
    UsersModule,
    AssetsModule,
    AreasModule,
    ProjectsModule,
    DocumentsModule,
    ProceduresModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
