import { Injectable } from '@nestjs/common';
import { CreateSparePartCategoryDto } from './dto/create-spare-part-category.dto';
import { ProjectSparePartCategory } from './entities/project-spare-part-category.entity';
import { ProjectSparePartCategoriesRepository } from './repositories/project-spare-part-categories.repository';
import { SparePartCategoryRepository } from './repositories/spare-part-categories.repository';
import { ProjectsService } from 'modules/projects/projects.service';
import { User } from 'modules/users/entities/user.entity';

@Injectable()
export class SparePartCategoriesService {
  constructor(
    private sparePartCategoryRepository: SparePartCategoryRepository,
    private projectSparePartCategoriesRepository: ProjectSparePartCategoriesRepository,
    private projectsService: ProjectsService,
  ) {}
  async findAndCreate(
    createSparePartCategoryDto: CreateSparePartCategoryDto,
  ): Promise<ProjectSparePartCategory> {
    try {
      const category = await this.sparePartCategoryRepository.findAndCreate(
        createSparePartCategoryDto,
      );

      const project = await this.projectsService.findOneById(
        createSparePartCategoryDto.projectId,
      );

      return await this.projectSparePartCategoriesRepository.findAndCreate(
        project,
        category,
      );
    } catch (error) {
      throw error;
    }
  }

  async findAllCategoriesOld(token, user): Promise<ProjectSparePartCategory[]> {
    const data = await this.projectsService.findMasterProjectsByUserId(user.id);
    const projectIds = data.map(({ project }) => project.id);

    return await this.projectSparePartCategoriesRepository
      .createQueryBuilder('spc')
      .leftJoinAndSelect('spc.project', 'project')
      .leftJoinAndSelect('spc.sparePartCategory', 'sparePartCategory')
      .where('project.id IN (:...projectIds)', {
        projectIds,
      })
      .getMany();
  }

  async findAllCategories(
    token: string,
    user: User,
    projectId = null,
  ): Promise<ProjectSparePartCategory[]> {
    const query = this.projectSparePartCategoriesRepository
      .createQueryBuilder('spc')
      .leftJoin('spc.project', 'project')
      .leftJoinAndSelect('spc.sparePartCategory', 'sparePartCategory')
      .where('project.branch =:branchId', {
        branchId: user.branch.id,
      });
    if (projectId) {
      query.andWhere('project.id = :projectId', { projectId });
    }
    query.distinctOn(['spc.sparePartCategory']);

    return query.getMany();
  }
  async findAllCategoriesByProject(
    projectId,
  ): Promise<ProjectSparePartCategory[]> {
    return await this.projectSparePartCategoriesRepository
      .createQueryBuilder('spc')
      .leftJoinAndSelect('spc.project', 'project')
      .leftJoinAndSelect('spc.sparePartCategory', 'sparePartCategory')
      .where('project.id = :projectId', {
        projectId,
      })
      .getMany();
  }
}
