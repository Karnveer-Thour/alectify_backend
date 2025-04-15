import { forwardRef, Module } from '@nestjs/common';
import { ProceduresController } from './procedures.controller';
import { ProceduresService } from './procedures.service';
import { ProceduresLibraryRepository } from './repositories/procedures-library.repository';
import { ProcedureLibraryStepsRepository } from './repositories/procedure-library-steps.repository';
import { AssetsModule } from 'modules/assets/assets.module';
import { AreasModule } from 'modules/areas/areas.module';
import { ProcedureStepsRepository } from './repositories/procedure-steps-repository';
import { ProceduresRepository } from './repositories/procedures-repository';
import { ProcedureCategoriesRepository } from './repositories/procedure-category-repository';
import { FilesUploadModule } from 'modules/files-upload/files-upload.module';
import { PreventiveMaintenanceDocumentsModule } from 'modules/preventive-maintenance-documents/preventive-maintenance-documents.module';
import { CommentsModule } from 'modules/comments/comments.module';
import { AWSConfig } from '@core/aws/aws.config';
import { ConfigModule } from '@nestjs/config';
import { PreventiveMaintenancesModule } from 'modules/preventive-maintenances/preventive-maintenances.module';
import { UsersModule } from 'modules/users/users.module';
import { DocumentsModule } from 'modules/documents/documents.module';
import { ProjectsModule } from 'modules/projects/projects.module';

@Module({
  imports: [
    FilesUploadModule,
    AssetsModule,
    AreasModule,
    DocumentsModule,
    CommentsModule,
    ConfigModule.forFeature(AWSConfig),
    forwardRef(() => PreventiveMaintenancesModule),
    UsersModule,
    PreventiveMaintenanceDocumentsModule,
    ProjectsModule,
  ],
  controllers: [ProceduresController],
  providers: [
    ProceduresService,
    ProceduresLibraryRepository,
    ProcedureLibraryStepsRepository,
    ProcedureStepsRepository,
    ProceduresRepository,
    ProcedureCategoriesRepository,
  ],
  exports: [ProceduresService],
})
export class ProceduresModule {}
