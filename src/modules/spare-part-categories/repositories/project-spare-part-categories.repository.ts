import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { Project } from 'modules/projects/entities/project.entity';
import { SubProject } from 'modules/projects/entities/sub-project.entity';
import { DataSource } from 'typeorm';
import { ProjectSparePartCategory } from '../entities/project-spare-part-category.entity';
import { SparePartCategory } from '../entities/spare-part-category.entity';

@Injectable()
export class ProjectSparePartCategoriesRepository extends BaseRepository<ProjectSparePartCategory> {
  constructor(private dataSource: DataSource) {
    super(ProjectSparePartCategory, dataSource);
  }

  async findAndCreate(
    project: Project,
    category: SparePartCategory,
  ): Promise<ProjectSparePartCategory> {
    const findOne = await this.createQueryBuilder('spc')
      .leftJoinAndSelect('spc.project', 'project')
      .where('spc.sparePartCategory = :sparePartCategory', {
        sparePartCategory: category.id,
      })
      .andWhere('project.id = :projectId', {
        projectId: project.id,
      })
      .getOne();
    if (findOne) {
      return findOne;
    }

    return await this.save(
      new ProjectSparePartCategory({
        sparePartCategory: category,
        project,
      }),
    );
  }
}
