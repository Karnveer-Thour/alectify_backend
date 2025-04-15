import { HttpWrapperModule } from '@common/http-wrapper/http-wrapper.module';
import { Module, forwardRef } from '@nestjs/common';
import { ManageOrdersModule } from '../manage-orders/manage-orders.module';
import { OperationApisModule } from '../operation-apis/operation-apis.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { ProjectsModule } from '../projects/projects.module';
import { SparePartCategoriesModule } from '../spare-part-categories/spare-part-categories.module';
import { ProjectSparePartRepository } from './repositories/project-spare-part.repository';
import { SparePartRepository } from './repositories/spare-part.repository';
import { SparePartsController } from './spare-parts.controller';
import { SparePartsService } from './spare-parts.service';
import { UsersModule } from 'modules/users/users.module';
import { FilesUploadModule } from 'modules/files-upload/files-upload.module';

@Module({
  imports: [
    OperationApisModule,
    HttpWrapperModule,
    SparePartCategoriesModule,
    forwardRef(() => ManageOrdersModule),
    ProjectsModule,
    UsersModule,
    OrganizationsModule,
    FilesUploadModule,
  ],
  controllers: [SparePartsController],
  providers: [
    SparePartsService,
    SparePartRepository,
    ProjectSparePartRepository,
  ],
  exports: [SparePartsService],
})
export class SparePartsModule {}
