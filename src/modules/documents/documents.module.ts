import { Module, forwardRef } from '@nestjs/common';
import { DocumentsViewRepository } from './repositories/documents-view.repository';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { AssetsModule } from 'modules/assets/assets.module';
import { AreasModule } from 'modules/areas/areas.module';
import { ProjectsModule } from 'modules/projects/projects.module';
import { PreventiveMaintenancesModule } from 'modules/preventive-maintenances/preventive-maintenances.module';
import { FilesUploadModule } from 'modules/files-upload/files-upload.module';
import { CommentsModule } from 'modules/comments/comments.module';
import { DocumentsRepository } from './repositories/documents.repository';
import { UsersModule } from 'modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    ProjectsModule,
    AssetsModule,
    AreasModule,
    forwardRef(() => PreventiveMaintenancesModule),
    FilesUploadModule,
    CommentsModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsRepository, DocumentsViewRepository, DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
