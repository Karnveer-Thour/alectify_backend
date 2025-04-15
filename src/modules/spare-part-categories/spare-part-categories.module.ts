import { HttpWrapperModule } from '@common/http-wrapper/http-wrapper.module';
import { Module } from '@nestjs/common';
import { OperationApisModule } from 'modules/operation-apis/operation-apis.module';
import { ProjectSparePartCategoriesRepository } from './repositories/project-spare-part-categories.repository';
import { SparePartCategoryRepository } from './repositories/spare-part-categories.repository';
import { SparePartCategoriesController } from './spare-part-categories.controller';
import { SparePartCategoriesService } from './spare-part-categories.service';
import { ProjectsModule } from 'modules/projects/projects.module';

@Module({
  imports: [OperationApisModule, HttpWrapperModule, ProjectsModule],
  controllers: [SparePartCategoriesController],
  providers: [
    SparePartCategoriesService,
    SparePartCategoryRepository,
    ProjectSparePartCategoriesRepository,
  ],
  exports: [SparePartCategoriesService],
})
export class SparePartCategoriesModule {}
