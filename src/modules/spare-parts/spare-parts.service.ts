import { BaseResponseDto } from '@common/dto/base-response.dto';
import { CSVToJSON } from '@common/utils/csv/csv-to-json';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { OperationApisWrapper } from '../operation-apis/operation-apis-wrapper';
import { SparePartCategoriesService } from '../spare-part-categories/spare-part-categories.service';
import { CreateSparePartResponseDto } from './dto/create-spare-part-response.dto';
import { CreateSparePartDto } from './dto/create-spare-part.dto';
import { GetAllSparePartsResponseDto } from './dto/get-all-spare-parts-response.dto';
import { GetSparePartCategoriesResponseDto } from './dto/get-project-spare-part-categories-response.dto';
import { UpdateSparePartDto } from './dto/update-spare-part.dto';
import { ProjectSparePart } from './entities/project-spare-part.entity';
import { SparePart } from './entities/spare-part.entity';
import { ProjectSparePartRepository } from './repositories/project-spare-part.repository';
import { SparePartRepository } from './repositories/spare-part.repository';
import { ManageOrdersService } from 'modules/manage-orders/manage-orders.service';
import { ProjectsService } from 'modules/projects/projects.service';
import { CreateManySparePartsDto } from './dto/create-many-spare-part.dto';
import { OrganizationsService } from 'modules/organizations/organizations.service';
import { Brackets, In } from 'typeorm';
import { DeleteSparePartDto } from './dto/delete-spare-part.dto';
import { User } from 'modules/users/entities/user.entity';
import { UsersService } from 'modules/users/users.service';
import { GetSparePartPreferredSuppliersResponseDto } from './dto/get-project-spare-part-preferred-suppliers-response.dto';
import { StatusFilters } from './models/status-filter.enum';
import { QuantityTypes } from 'modules/manage-orders/models/quantity-types.enum';
import {
  cleanHtmlTags,
  dateToUTC,
  decodeURL,
  toArray,
} from '@common/utils/utils';
import * as moment from 'moment';
import {
  SparePartDashboardMonthlyHistoryResponseDto,
  SparePartDashboardStatsResponseDto,
  SparePartsMonthlyCostResponse,
} from './dto/get-dasboard-spare-parts-stats.dto';
import * as fs from 'fs';
// import * as csv from 'csv-parser';
import { createObjectCsvStringifier, createObjectCsvWriter } from 'csv-writer';
import { Response } from 'express';
import { FilesUploadService } from 'modules/files-upload/files-upload.service';
import { GetAdvisorySummariesResponseDto } from './dto/get-advisory-summaries-response.dto';

interface MonthlyTotalPrice {
  month: string;
  drawTotal: number;
  restockTotal: number;
}
@Injectable()
export class SparePartsService {
  constructor(
    private sparePartRepository: SparePartRepository,
    private projectSparePartRepository: ProjectSparePartRepository,
    private sparePartCategoriesService: SparePartCategoriesService,
    @Inject(forwardRef(() => ManageOrdersService))
    private manageOrdersService: ManageOrdersService,
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private organizationsService: OrganizationsService,
    private fileUploadService: FilesUploadService,
    private readonly operationApis: OperationApisWrapper,
    private userService: UsersService,
  ) {}
  async create(
    createSparePartDto: CreateSparePartDto,
  ): Promise<CreateSparePartResponseDto> {
    try {
      const {
        category,
        projectId,
        partNumber,
        description,
        preferredSupplierName,
      } = createSparePartDto;

      const findCategory = category
        ? await this.sparePartCategoriesService.findAndCreate({
            category,
            projectId,
          })
        : null;

      const project = await this.projectsService.findOneById(projectId);

      const preferredSupplier =
        await this.organizationsService.findOneByNameOrCreate(
          preferredSupplierName,
        );

      const sparePart = await this.sparePartRepository.findAndCreate(
        new SparePart({
          partNumber,
          description,
        }),
      );

      const projectSparePart = await this.projectSparePartRepository.save(
        new ProjectSparePart({
          ...createSparePartDto,
          projectSparePartCategory: findCategory,
          sparePart: sparePart,
          project: project,
          preferredSupplier,
        }),
      );
      return {
        message: 'Spare part created successfully',
        data: projectSparePart,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdvisorySummaries(
    user: User,
    projectId?: string,
  ): Promise<GetAdvisorySummariesResponseDto> {
    try {
      let advisorySummaries;

      const queryBuilder = this.projectSparePartRepository
        .createQueryBuilder('psp')
        .leftJoinAndSelect('psp.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect('psp.sparePart', 'sparePart')
        .leftJoinAndSelect('psp.project', 'project')
        .leftJoinAndSelect('psp.projectSparePartCategory', 'spc')
        .leftJoinAndSelect('spc.sparePartCategory', 'sparePartCategory')
        .select([
          'psp.id AS Id',
          'psp.summary AS summary',
          'project.name AS projectName',
          'preferredSupplier.name AS preferredSupplierName',
          'sparePart.partNumber AS partNumber',
          'sparePart.description AS description',
          'psp.system AS system',
          'sparePartCategory.category AS category',
        ])
        .where('psp.isAdvisory = :isAdvisory', { isAdvisory: true })
        .andWhere('psp.deletedAt IS NULL');

      const projects = await this.projectsService.findMasterProjectsByUserId(
        user.id,
      );
      const projectIds = projects.map(({ project }) => project.id);

      if (projectId) {
        if (!projectIds.includes(projectId)) {
          return {
            message:
              'You are not authorized to retrieve advisory summaries for this project!',
            data: [],
          };
        }

        advisorySummaries = await queryBuilder
          .andWhere('psp.project.id = :projectId', { projectId })
          .getRawMany();
      } else {
        if (!projectIds.length) {
          return {
            message: 'Advisory summaries retrieved successfully',
            data: [],
          };
        }

        advisorySummaries = await queryBuilder
          .andWhere('project.id IN (:...projectIds)', { projectIds })
          .getRawMany();
      }
      const formattedSummaries = advisorySummaries.map((summary) => ({
        id: summary.id,
        summary: summary.summary,
        projectName: summary.projectname,
        preferredSupplierName: summary.preferredsuppliername,
        partNumber: summary.partnumber,
        description: summary.description,
        system: summary.system,
        category: summary.category,
      }));
      return {
        message: 'Advisory summaries retrieved successfully',
        data: formattedSummaries,
      };
    } catch (error) {
      throw Error(
        'Failed to retrieve advisory summaries. Please try again later.',
      );
    }
  }

  async findAllCategories(
    token: string,
    user: User,
    projectId = null,
  ): Promise<GetSparePartCategoriesResponseDto> {
    user = await this.usersService.findOneById(user.id);
    return {
      message: 'Get all categories by project',
      data: await this.sparePartCategoriesService.findAllCategories(
        token,
        user,
        projectId,
      ),
    };
  }
  async findAllPreferredSuppliers(
    token: string,
    user: User,
    projectId = null,
  ): Promise<GetSparePartPreferredSuppliersResponseDto> {
    user = await this.usersService.findOneById(user.id);

    return {
      message: 'Get all categories by project',
      data: await this.organizationsService.findBySpareParts(user, projectId),
    };
  }
  async findAllCategoriesByProject(
    projectId: string,
  ): Promise<GetSparePartCategoriesResponseDto> {
    return {
      message: 'Get all preferred suppliers by project',
      data: await this.sparePartCategoriesService.findAllCategoriesByProject(
        projectId,
      ),
    };
  }

  async findAll(
    token: string,
    user: User,
    categoryId: string | string[],
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    partNumber: string,
    description: string,
    preferredSupplierId: string | string[],
    preferredSupplierName: string,
    system: string,
    projectId: string,
    status: string,
    search: string,
    pendingOrdersOnly: string,
    options: IPaginationOptions,
  ): Promise<GetAllSparePartsResponseDto> {
    try {
      categoryId = toArray(categoryId);
      preferredSupplierId = toArray(preferredSupplierId);
      const spareParts = this.projectSparePartRepository
        .createQueryBuilder('psp')
        .leftJoinAndSelect('psp.project', 'project')
        .leftJoinAndSelect('psp.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect(
          'psp.projectSparePartCategory',
          'projectSparePartCategory',
        )
        .leftJoinAndSelect(
          'psp.manageOrders',
          'manageOrders',
          'manageOrders.completedAt IS NULL',
        )
        .leftJoinAndSelect('psp.sparePart', 'sparePart')
        .leftJoinAndSelect(
          'projectSparePartCategory.sparePartCategory',
          'sparePartCategory',
        )
        .leftJoinAndSelect('psp.manageOrdersView', 'manageOrdersView');
      if (pendingOrdersOnly === 'true') {
        spareParts.leftJoinAndSelect('manageOrders.orderedBy', 'orderedBy');
      }

      if (projectId) {
        spareParts.where('project.id =:projectId', {
          projectId,
        });
      } else {
        const data = await this.projectsService.findMasterProjectsByUserId(
          user.id,
        );
        const projectIds = data.map(({ project }) => project.id);
        if (!projectIds.length) {
          return {
            message: 'Get all spare parts successfully',
            data: [],
            meta: {
              currentPage: Number(options.page),
              totalItems: 0,
              itemCount: Number(options.limit),
              itemsPerPage: Number(options.limit),
              totalPages: 0,
            },
          };
        }
        spareParts.where('project.id IN (:...projectIds)', {
          projectIds,
        });
      }
      if (categoryId.length) {
        spareParts.andWhere('sparePartCategory.id IN (:...categoryId)', {
          categoryId,
        });
      }
      if (status) {
        if (status === StatusFilters.LOW_INVENTORY) {
          spareParts
            .andWhere('psp.remainingQuantity <= psp.minimumQuantity')
            .andWhere('psp.remainingQuantity != 0');
        }
        if (status === StatusFilters.OUT_OF_STOCK) {
          spareParts.andWhere('psp.remainingQuantity <= 0');
        }
        if (status === StatusFilters.NORMAL) {
          spareParts.andWhere('psp.remainingQuantity > psp.minimumQuantity');
        }
      }
      if (partNumber) {
        spareParts.andWhere('sparePart.partNumber ILIKE :partNumber', {
          partNumber: `%${partNumber}%`,
        });
      }
      if (description) {
        spareParts.andWhere('sparePart.description ILIKE :description', {
          description: `%${description}%`,
        });
      }
      if (preferredSupplierId.length) {
        spareParts.andWhere(
          'preferredSupplier.id IN (:...preferredSupplierId)',
          {
            preferredSupplierId,
          },
        );
      }
      if (preferredSupplierName) {
        spareParts.andWhere(
          'preferredSupplier.name  ILIKE =:preferredSupplierName',
          {
            preferredSupplierName,
          },
        );
      }
      if (system) {
        spareParts.andWhere('psp.system ILIKE :system', {
          system: `%${system}%`,
        });
      }

      if (search) {
        spareParts.andWhere(
          new Brackets((qb) => {
            qb.where('project.name ILIKE :search', {
              search: `%${search}%`,
            })
              .orWhere('preferredSupplier.name ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('sparePart.partNumber ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('sparePart.description ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('sparePartCategory.category ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('psp.system ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('psp.comments ILIKE :search', {
                search: `%${search}%`,
              });
          }),
        );
      }

      if (pendingOrdersOnly === 'true') {
        spareParts.andWhere('manageOrders.id IS NOT NULL');
      }

      if (orderField && orderBy) {
        if (orderField === 'category') {
          spareParts.addOrderBy(`sparePartCategory.category`, orderBy);
        } else if (orderField === 'partNumber') {
          spareParts.addOrderBy(`sparePart.partNumber`, orderBy);
        } else if (orderField === 'description') {
          spareParts.addOrderBy(`sparePart.description`, orderBy);
        } else if (orderField === 'status') {
          spareParts.addOrderBy(`manageOrdersView.pendingItems`, orderBy);
        } else {
          spareParts.addOrderBy(`psp.${orderField}`, orderBy);
        }
      } else if (pendingOrdersOnly === 'true') {
        spareParts.orderBy('manageOrders.created_at', 'DESC');
      } else {
        spareParts.orderBy('psp.created_at', 'DESC');
        // spareParts.orderBy('manageOrdersView.pendingItems', 'ASC');
      }

      const { items, meta, links } = await paginate<ProjectSparePart>(
        spareParts,
        options,
      );

      return {
        message: 'Get all spare parts successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllByBranch(
    user: User,
    projectId: string,
    categoryId: string | string[],
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    partNumber: string,
    description: string,
    preferredSupplierId: string | string[],
    preferredSupplierName: string,
    system: string,
    status: string,
    search: string,
    options: IPaginationOptions,
  ): Promise<GetAllSparePartsResponseDto> {
    try {
      categoryId = toArray(categoryId);
      preferredSupplierId = toArray(preferredSupplierId);
      user = await this.usersService.findOneById(user.id);
      const spareParts = this.projectSparePartRepository
        .createQueryBuilder('psp')
        .leftJoinAndSelect('psp.project', 'project')
        .leftJoinAndSelect('psp.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect(
          'psp.projectSparePartCategory',
          'projectSparePartCategory',
        )
        .leftJoinAndSelect('psp.sparePart', 'sparePart')
        .leftJoinAndSelect(
          'projectSparePartCategory.sparePartCategory',
          'sparePartCategory',
        )
        .leftJoinAndSelect('psp.manageOrdersView', 'manageOrdersView')
        .where('project.branch =:branchId', {
          branchId: user.branch.id,
        });
      if (projectId) {
        spareParts.where('project.id =:projectId', {
          projectId,
        });
      }
      if (categoryId.length) {
        spareParts.andWhere('sparePartCategory.id IN (:...categoryId)', {
          categoryId,
        });
      }
      if (status) {
        if (status === StatusFilters.LOW_INVENTORY) {
          spareParts
            .andWhere('psp.remainingQuantity <= psp.minimumQuantity')
            .andWhere('psp.remainingQuantity != 0');
        }
        if (status === StatusFilters.OUT_OF_STOCK) {
          spareParts.andWhere('psp.remainingQuantity <= 0');
        }
        if (status === StatusFilters.NORMAL) {
          spareParts.andWhere('psp.remainingQuantity > psp.minimumQuantity');
        }
      }
      if (partNumber) {
        spareParts.andWhere('sparePart.partNumber ILIKE :partNumber', {
          partNumber: `%${partNumber}%`,
        });
      }
      if (description) {
        spareParts.andWhere('sparePart.description ILIKE :description', {
          description: `%${description}%`,
        });
      }
      if (preferredSupplierId.length) {
        spareParts.andWhere(
          'preferredSupplier.id IN (:...preferredSupplierId)',
          {
            preferredSupplierId,
          },
        );
      }
      if (preferredSupplierName) {
        spareParts.andWhere(
          'preferredSupplier.name  ILIKE =:preferredSupplierName',
          {
            preferredSupplierName,
          },
        );
      }
      if (system) {
        spareParts.andWhere('psp.system ILIKE :system', {
          system: `%${system}%`,
        });
      }

      if (search) {
        spareParts.andWhere(
          new Brackets((qb) => {
            qb.where('project.name ILIKE :search', {
              search: `%${search}%`,
            })
              .orWhere('preferredSupplier.name ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('sparePart.partNumber ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('sparePart.description ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('sparePartCategory.category ILIKE :search', {
                search: `%${search}%`,
              });
          }),
        );
      }
      if (orderField && orderBy) {
        if (orderField === 'category') {
          spareParts.addOrderBy(`sparePartCategory.category`, orderBy);
        } else if (orderField === 'partNumber') {
          spareParts.addOrderBy(`sparePart.partNumber`, orderBy);
        } else if (orderField === 'description') {
          spareParts.addOrderBy(`sparePart.description`, orderBy);
        } else if (orderField === 'status') {
          spareParts.addOrderBy(`manageOrdersView.pendingItems`, orderBy);
        } else {
          spareParts.addOrderBy(`psp.${orderField}`, orderBy);
        }
      } else {
        spareParts.orderBy('psp.created_at', 'DESC');
      }
      const { items, meta, links } = await paginate<ProjectSparePart>(
        spareParts,
        options,
      );

      return {
        message: 'Get all global spare parts successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async findPartsById(
    token: string,
    user: User,
    id: string,
    options: IPaginationOptions,
  ): Promise<GetAllSparePartsResponseDto> {
    try {
      let findPart = null;
      if (
        id.match(
          '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
        )
      ) {
        findPart = await this.findById(id);
      }
      user = await this.usersService.findOneById(user.id);
      const spareParts = this.projectSparePartRepository
        .createQueryBuilder('psp')
        .leftJoinAndSelect('psp.project', 'project')
        .leftJoinAndSelect('psp.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect(
          'psp.projectSparePartCategory',
          'projectSparePartCategory',
        )
        .leftJoinAndSelect('psp.sparePart', 'sparePart')
        .leftJoinAndSelect(
          'projectSparePartCategory.sparePartCategory',
          'sparePartCategory',
        )
        .leftJoinAndSelect('psp.manageOrdersView', 'manageOrdersView');

      // const { data } = await this.operationApis.getMainProjects(token);
      // const projectIds = data.map(({ id }) => id);
      // spareParts.where('project.id IN (:...projectIds)', {
      //   projectIds,
      // });
      spareParts.where('project.branch =:branchId', {
        branchId: user.branch.id,
      });
      if (findPart) {
        spareParts
          .andWhere('psp.id !=:id', {
            id: id,
          })
          .andWhere('sparePart.partNumber =:partNumber', {
            partNumber: findPart.sparePart.partNumber,
          });
      } else {
        spareParts.andWhere(
          'LOWER(sparePart.partNumber) = LOWER(:partNumber)',
          {
            partNumber: id,
          },
        );
      }
      const { items, meta, links } = await paginate<ProjectSparePart>(
        spareParts,
        options,
      );
      return {
        message: 'Get all spare parts successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllByProject(
    user: any,
    projectId: string,
    categoryId: string | string[],
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    partNumber: string,
    description: string,
    preferredSupplierName: string,
    system: string,
    options: IPaginationOptions,
  ): Promise<GetAllSparePartsResponseDto> {
    try {
      categoryId = toArray(categoryId);

      const spareParts = this.projectSparePartRepository
        .createQueryBuilder('psp')
        .leftJoinAndSelect('psp.project', 'project')
        .leftJoinAndSelect('psp.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect(
          'psp.projectSparePartCategory',
          'projectSparePartCategory',
        )
        .leftJoinAndSelect('psp.sparePart', 'sparePart')
        .leftJoinAndSelect(
          'projectSparePartCategory.sparePartCategory',
          'sparePartCategory',
        )
        .leftJoinAndSelect('psp.manageOrdersView', 'manageOrdersView')
        .where('project.id =:projectId', { projectId });

      if (categoryId.length) {
        spareParts.andWhere(
          'psp.projectSparePartCategory IN (:...categoryId)',
          {
            categoryId,
          },
        );
      }
      if (partNumber) {
        spareParts.andWhere('sparePart.partNumber ILIKE :partNumber', {
          partNumber: `%${partNumber}%`,
        });
      }
      if (description) {
        spareParts.andWhere('sparePart.description ILIKE :description', {
          description: `%${description}%`,
        });
      }
      if (preferredSupplierName) {
        spareParts.andWhere(
          'preferredSupplier.name ILIKE :preferredSupplierName',
          {
            preferredSupplierName: `%${preferredSupplierName}%`,
          },
        );
      }
      if (system) {
        spareParts.andWhere('psp.system ILIKE :system', {
          system: `%${system}%`,
        });
      }

      if (orderField && orderBy) {
        if (orderField === 'category') {
          spareParts.addOrderBy(`sparePartCategory.category`, orderBy);
        } else if (orderField === 'partNumber') {
          spareParts.addOrderBy(`sparePart.partNumber`, orderBy);
        } else if (orderField === 'description') {
          spareParts.addOrderBy(`sparePart.description`, orderBy);
        } else if (orderField === 'status') {
          spareParts.addOrderBy(`manageOrdersView.pendingItems`, orderBy);
        } else {
          spareParts.addOrderBy(`psp.${orderField}`, orderBy);
        }
      } else {
        // spareParts.orderBy('psp.created_at', 'DESC');
        spareParts.orderBy('manageOrdersView.pendingItems', 'ASC');
      }

      const { items, meta, links } = await paginate<ProjectSparePart>(
        spareParts,
        options,
      );

      return {
        message: 'Get all spare parts successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllByAsset(
    user: any,
    projectId: string,
    assetId: string,
    categoryId: string | string[],
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    partNumber: string,
    description: string,
    preferredSupplierName: string,
    system: string,
    options: IPaginationOptions,
  ): Promise<GetAllSparePartsResponseDto> {
    try {
      categoryId = toArray(categoryId);
      const spareParts = this.projectSparePartRepository
        .createQueryBuilder('psp')
        .leftJoinAndSelect('psp.project', 'project')
        .leftJoinAndSelect('psp.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect(
          'psp.projectSparePartCategory',
          'projectSparePartCategory',
        )
        .leftJoinAndSelect('psp.sparePart', 'sparePart')
        .leftJoinAndSelect(
          'projectSparePartCategory.sparePartCategory',
          'sparePartCategory',
        )
        .leftJoinAndSelect('psp.manageOrdersView', 'manageOrdersView')
        .leftJoin('psp.manageOrderHistories', 'manageOrderHistories')
        .leftJoinAndSelect('manageOrderHistories.asset', 'asset')
        .where('project.id =:projectId', { projectId })
        .andWhere('asset.id =:assetId', { assetId });

      if (categoryId.length) {
        spareParts.andWhere(
          'psp.projectSparePartCategory IN (:...categoryId)',
          {
            categoryId,
          },
        );
      }
      if (partNumber) {
        spareParts.andWhere('sparePart.partNumber ILIKE :partNumber', {
          partNumber: `%${partNumber}%`,
        });
      }
      if (description) {
        spareParts.andWhere('sparePart.description ILIKE :description', {
          description: `%${description}%`,
        });
      }
      if (preferredSupplierName) {
        spareParts.andWhere(
          'psp.preferredSupplierName ILIKE :preferredSupplierName',
          {
            preferredSupplierName: `%${preferredSupplierName}%`,
          },
        );
      }
      if (system) {
        spareParts.andWhere('psp.system ILIKE :system', {
          system: `%${system}%`,
        });
      }

      if (orderField && orderBy) {
        if (orderField === 'category') {
          spareParts.addOrderBy(`sparePartCategory.category`, orderBy);
        } else if (orderField === 'partNumber') {
          spareParts.addOrderBy(`sparePart.partNumber`, orderBy);
        } else if (orderField === 'description') {
          spareParts.addOrderBy(`sparePart.description`, orderBy);
        } else {
          spareParts.addOrderBy(`psp.${orderField}`, orderBy);
        }
      } else {
        spareParts.orderBy('psp.created_at', 'DESC');
      }

      const { items, meta, links } = await paginate<ProjectSparePart>(
        spareParts,
        options,
      );

      return {
        message: 'Get all spare parts successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateSparePartDto: UpdateSparePartDto,
  ): Promise<CreateSparePartResponseDto> {
    try {
      const isExist = await this.projectSparePartRepository.findOneBy({
        id,
      });

      if (!isExist) {
        throw new NotFoundException('Spare parts does not exist');
      }

      const { category, projectId, partNumber, description } =
        updateSparePartDto;

      const findCategory = category
        ? await this.sparePartCategoriesService.findAndCreate({
            category,
            projectId,
          })
        : null;

      const project = await this.projectsService.findOneById(projectId);

      const sparePart = await this.sparePartRepository.findAndCreate(
        new SparePart({
          partNumber,
          description,
        }),
      );

      if (description !== sparePart.description) {
        await this.sparePartRepository.save(
          new SparePart({
            ...sparePart,
            description,
          }),
        );
      }

      const preferredSupplier = await this.organizationsService.findOneById(
        updateSparePartDto.preferredSupplierId,
      );

      const projectSparePart = await this.projectSparePartRepository.save(
        new ProjectSparePart({
          ...isExist,
          ...updateSparePartDto,
          projectSparePartCategory: findCategory,
          sparePart: sparePart,
          project: project,
          preferredSupplier,
        }),
      );
      return {
        message: 'Spare part updated successfully',
        data: projectSparePart,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateImage(
    user: User,
    token: string,
    id: string,
    uploadedImage: Express.Multer.File,
  ): Promise<CreateSparePartResponseDto> {
    try {
      if (!uploadedImage) {
        throw new BadRequestException('Image is required');
      }
      user = await this.userService.findOneById(user.id);
      const isExist = await this.sparePartRepository.findOneBy({
        id,
      });

      if (!isExist) {
        throw new NotFoundException('Spare parts does not exist');
      }
      isExist.imageUrl = isExist.imageUrl ? decodeURL(isExist.imageUrl) : null;
      if (isExist.imageUrl) {
        await this.fileUploadService.fileDelete(isExist.imageUrl);
      }
      const fileUpload = await this.fileUploadService.fileUpload(
        uploadedImage,
        'spare-parts',
        true,
        token,
        user.branch.company.id,
      );
      const sparePart = await this.sparePartRepository.save({
        ...isExist,
        imageUrl: fileUpload.key,
      });
      return {
        message: 'Spare part updated successfully',
        data: sparePart,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<CreateSparePartResponseDto> {
    try {
      const projectSparePart = await this.projectSparePartRepository
        .createQueryBuilder('psp')
        .leftJoinAndSelect('psp.project', 'project')
        .leftJoinAndSelect('psp.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect(
          'psp.projectSparePartCategory',
          'projectSparePartCategory',
        )
        .leftJoinAndSelect(
          'psp.manageOrders',
          'manageOrders',
          'manageOrders.completedAt IS NULL',
        )
        .leftJoinAndSelect('psp.sparePart', 'sparePart')
        .leftJoinAndSelect(
          'projectSparePartCategory.sparePartCategory',
          'sparePartCategory',
        )
        .leftJoinAndSelect('psp.manageOrdersView', 'manageOrdersView')
        .where('psp.id =:id', { id })
        .getOne();

      if (!projectSparePart) {
        throw new NotFoundException('Spare parts does not exist');
      }

      return {
        message: 'Get spare part successfully',
        data: projectSparePart,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<BaseResponseDto> {
    try {
      const isExist = await this.projectSparePartRepository.findOneBy({
        id,
      });

      if (!isExist) {
        throw new NotFoundException('Spare parts does not exist');
      }

      // await this.manageOrdersService.deleteByProjectSparePart(isExist);
      // await this.projectSparePartRepository.softDelete({ id });

      await this.projectSparePartRepository.save({
        id: isExist.id,
        deletedAt: dateToUTC(),
      });

      return {
        message: 'Spare part deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async createManyWithCSV(
    createManySparePartsDto: CreateManySparePartsDto,
    file: Express.Multer.File,
  ): Promise<BaseResponseDto> {
    try {
      const sparePartCSV = CSVToJSON<any>(file.buffer.toString());

      // for create Organization
      // const getOrganizationTypes =
      //   await this.operationApis.getOrganizationTypes(token);

      // const contractorData = getOrganizationTypes.data.find(
      //   ({ name }) => name === 'Contractor',
      // );
      // await this.operationApis.createOrganizations(token, {
      //   name: sp.suppliername,
      //   org_type: contractorData.id,
      // });

      const project = await this.projectsService.findOneById(
        createManySparePartsDto.projectId,
      );

      const sparePartMap = [];

      for (let index = 0; index < sparePartCSV.length; index++) {
        const sp = sparePartCSV[index];
        if (sp.partnumber) {
          const preferredSupplier =
            await this.organizationsService.findOneByNameOrCreate(
              sp.suppliername,
            );
          sparePartMap.push({
            ...sp,
            projectId: createManySparePartsDto.projectId,
            preferredSupplierId: preferredSupplier?.id,
            partNumber: sp.partnumber,
            firmwareVersion: sp.firmwareversion,
            preferredSupplierName: sp.suppliername,
            price:
              sp?.price && (sp?.price === 'N/A' || sp?.price === '')
                ? 0
                : isNaN(Number((sp?.price ?? '0').replace(/[^0-9.]/g, '')))
                ? 0
                : Number((sp?.price ?? '0').replace(/[^0-9.]/g, '')),
            remainingQuantity:
              sp?.remainingquantity && sp.remainingquantity === ''
                ? null
                : isNaN(Number(sp.remainingquantity))
                ? 0
                : Number(sp.remainingquantity),
            minimumQuantity:
              sp?.minimumquantity && sp.minimumquantity === ''
                ? null
                : isNaN(Number(sp.minimumquantity))
                ? 1
                : Number(sp.minimumquantity),
          });
        }
      }

      for (let i = 0; i < sparePartMap.length; i++) {
        const sparePart = sparePartMap[i];
        await this.create(sparePart);
      }
      return {
        message: 'Spare parts created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async updateQuantity(
    id: string,
    quantity: number,
  ): Promise<CreateSparePartResponseDto> {
    try {
      const isExist = await this.projectSparePartRepository.findOneBy({
        id,
      });
      if (!isExist) {
        throw new NotFoundException('Spare parts does not exist');
      }

      const projectSparePart = await this.projectSparePartRepository.save(
        new ProjectSparePart({
          ...isExist,
          remainingQuantity: quantity + isExist.remainingQuantity,
        }),
      );
      return {
        message: 'Spare part updated successfully',
        data: projectSparePart,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateQuantityAndPrice(
    id: string,
    quantity: number,
    price: number | null,
  ): Promise<CreateSparePartResponseDto> {
    try {
      const isExist = await this.projectSparePartRepository.findOneBy({
        id,
      });
      if (!isExist) {
        throw new NotFoundException('Spare parts does not exist');
      }

      const projectSparePart = await this.projectSparePartRepository.save(
        new ProjectSparePart({
          ...isExist,
          price,
          remainingQuantity: quantity,
        }),
      );
      return {
        message: 'Spare part updated successfully',
        data: projectSparePart,
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<ProjectSparePart> {
    return this.projectSparePartRepository.findById(id);
  }

  async deleteSparePart(
    deleteSparePartDto: DeleteSparePartDto,
  ): Promise<BaseResponseDto> {
    try {
      await this.projectSparePartRepository.softDelete({
        id: In(deleteSparePartDto.ids),
      });
      return {
        message: 'Spare parts deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getSparePartStats(
    projectId: string,
    token: string,
    user: User,
    startDate:any,
    endDate:any
  ): Promise<SparePartDashboardStatsResponseDto> {
    let projectIds = [projectId];
    const data= {
      totalCost: 0,
      currentYearCost: 0,
      totalCount: 0,
      outOfStockCount: 0,
      lowInventoryCount: 0,
      drawTotal:0,
      reStockTotal:0
    }
    
    if((startDate || endDate) && !(startDate && endDate)){
      if(!startDate){
        return {
          data,
          message: 'start Date also required',
        }
      }else if(!endDate){
        return {
          data,
          message: 'end Date also required',
        }
      }
    }

    if(startDate>endDate){
      return {
        data,
        message: "start date cannot be greater than end date"
      }
    }

    if (!projectId) {
      const data = await this.projectsService.findMasterProjectsByUserId(
        user.id,
      );
      projectIds = data.map(({ project }) => project.id);
      if (!projectIds.length) {
        return {
          data: {
            totalCost: 0,
            currentYearCost: 0,
            totalCount: 0,
            outOfStockCount: 0,
            lowInventoryCount: 0,
            drawTotal:0,
            reStockTotal:0
          },
          message: 'Get spare parts dashboard stats successfully.',
        };
      }
    }

    const currentYear=moment().year();
    if(!startDate)startDate=moment().year(currentYear).startOf('year').toDate();
    if(!endDate)endDate=moment().year(currentYear).endOf('year').toDate();

    const [inventoryCounts, totalCost, currentYearCost,monthlyTotals] = await Promise.all([
      this.getInventoryCounts(projectIds, dateToUTC(startDate),dateToUTC(endDate)),
      this.getCurrentYearOrTotalCost(projectIds),
      this.getCurrentYearOrTotalCost(projectIds, dateToUTC(startDate),dateToUTC(endDate)),
      this.getCurrentYearTotalStock(projectIds,dateToUTC(startDate),dateToUTC(endDate))
    ]);
   

    return {
      data: {
        totalCost,
        currentYearCost,
        drawTotal:monthlyTotals.reduce(
          (sum, result) => (sum += Number(result.drawTotal) ?? 0),
          0,
        ),
        reStockTotal: monthlyTotals.reduce(
          (sum, result) => (sum += Number(result.restockTotal) ?? 0),
          0,
        ),
        ...inventoryCounts,
        // result,
      },
      message: 'Get spare parts dashboard stats successfully.',
    };
  }


  async getCurrentYearTotalStock(projectIds: string[],startDate?:Date,endDate?:Date) {
    const query = this.projectSparePartRepository
        .createQueryBuilder('psp')
        .leftJoin('psp.project', 'project')
        .where('project.id IN (:...projectIds)', { projectIds })
        .leftJoin('psp.manageOrderHistories', 'manageOrderHistories')
        .andWhere(
          'DATE(manageOrderHistories.createdAt) BETWEEN :startDate AND :endDate',
          { startDate,endDate},
        )
        .groupBy('psp.id')
        .addSelect(
          'SUM(CASE WHEN manageOrderHistories.quantityType = :borrow THEN manageOrderHistories.quantity ELSE 0 END * COALESCE(manageOrderHistories.price, 0))',
          'drawTotal',
        )
        .addSelect(
          'SUM(CASE WHEN manageOrderHistories.quantityType = :restock THEN manageOrderHistories.quantity ELSE 0 END * COALESCE(manageOrderHistories.price, 0))',
          'restockTotal',
        )
        .setParameter('borrow', QuantityTypes.BORROW)
        .setParameter('restock', QuantityTypes.RESTOCK);

      return await query.getRawMany();
  }


  async getCurrentYearOrTotalCost(projectIds: string[], startDate?: Date,endDate?:Date) {
    // const qtyQuery = this.projectSparePartRepository
    //   .createQueryBuilder('psp')
    //   .leftJoinAndSelect('psp.project', 'project')
    //   .where('project.id IN (:...projectIds)', {
    //     projectIds,
    //   })
    //   .leftJoin('psp.manageOrderHistories', 'manageOrderHistories')
    //   .andWhere('manageOrderHistories.quantityType = :type', {
    //     type: QuantityTypes.BORROW,
    //   })
    //   .select('SUM(manageOrderHistories.quantity)', 'totalBorrowedQuantity');

    const totalPriceQuery = this.projectSparePartRepository
      .createQueryBuilder('psp')
      .leftJoinAndSelect('psp.project', 'project')
      .where('project.id IN (:...projectIds)', { projectIds })
      .leftJoin('psp.manageOrderHistories', 'manageOrderHistories')
      .select(
        'SUM(psp.remainingQuantity * COALESCE(psp.price, 0))',
        'totalPrice',
      );

    if (startDate && endDate) {
      // qtyQuery.andWhere('manageOrderHistories.createdAt >= :startYear', {
      //   startYear: dateToUTC(yearStart),
      // });
      totalPriceQuery.andWhere(
        'DATE(psp.createdAt) BETWEEN :startDate AND :endDate',
        { startDate,endDate},
      )
    }

    // const { totalBorrowedQuantity } = await qtyQuery.getRawOne();
    const { totalPrice } = await totalPriceQuery.getRawOne();

    const totalCost = totalPrice;
    return totalCost;
  }

  async getInventoryCounts(projectIds: string[], startDate?: Date,endDate?:Date) {
    const inventoryCounts = await this.projectSparePartRepository
      .createQueryBuilder('psp')
      .leftJoinAndSelect('psp.project', 'project')
      .where('project.id IN (:...projectIds)', { projectIds })
      .andWhere(
        'DATE(psp.createdAt) BETWEEN :startDate AND :endDate',
        { startDate,endDate},
      )
      .select([
        'COUNT(psp.id) AS totalCount',
        'SUM(CASE WHEN psp.remainingQuantity <= psp.minimumQuantity AND psp.remainingQuantity != 0 THEN 1 ELSE 0 END) AS lowInventoryCount',
        'SUM(CASE WHEN psp.remainingQuantity <= 0 THEN 1 ELSE 0 END) AS outOfStockCount',
      ])
      .getRawOne();

    return {
      totalCount: parseInt(inventoryCounts?.totalcount || 0),
      outOfStockCount: parseInt(inventoryCounts?.outofstockcount || 0),
      lowInventoryCount: parseInt(inventoryCounts?.lowinventorycount || 0),
    };
  }

  async getMonthlyHistoryCounts(
    projectId: string,
    token: string,
    user: User,
  ): Promise<SparePartDashboardMonthlyHistoryResponseDto> {
    const year = new Date().getFullYear();
    const monthlyCounts: any = [];

    let projectIds = [projectId];

    if (!projectId) {
      const data = await this.projectsService.findMasterProjectsByUserId(
        user.id,
      );
      projectIds = data.map(({ project }) => project.id);
    }

    for (let month = 1; month <= 12; month++) {
      const startDate = moment()
        .year(year)
        .month(month - 1)
        .startOf('month')
        .format('YYYY-MM-DD');
      const endDate = moment()
        .year(year)
        .month(month - 1)
        .endOf('month')
        .format('YYYY-MM-DD');
      const monthName = moment()
        .month(month - 1)
        .format('MMM, 24');

      const result = await this.projectSparePartRepository
        .createQueryBuilder('psp')
        .leftJoinAndSelect('psp.project', 'project')
        .where('project.id IN (:...projectIds)', { projectIds })
        .leftJoin('psp.manageOrderHistories', 'manageOrderHistories')
        .andWhere(
          'DATE(manageOrderHistories.createdAt) BETWEEN :startDate AND :endDate',
          { startDate, endDate },
        )
        .select([
          'SUM(CASE WHEN manageOrderHistories.quantityType = :refill THEN manageOrderHistories.quantity ELSE 0 END) AS refillCount',
          'SUM(CASE WHEN manageOrderHistories.quantityType = :draw THEN manageOrderHistories.quantity ELSE 0 END) AS drawCount',
        ])
        .setParameter('refill', 'RESTOCK')
        .setParameter('draw', 'BORROW')
        .getRawOne(); // RESTOCK = REFILL, BORROW = DRAW

      monthlyCounts.push({
        year,
        month: monthName,
        refillCount: parseInt(result.refillcount),
        drawCount: parseInt(result.drawcount),
      });
    }

    return {
      data: monthlyCounts,
      message: 'Get spare part dashboard monthly history counts.',
    };
  }

  // async getCurrentYearMonthlyCost(
  //   projectId: string,
  //   token: string,
  // ): Promise<SparePartsMonthlyCostResponse> {
  //   const monthlyCosts: SparePartsMonthlyCost[] = [];
  //   let projectIds = [projectId];
  //   const currentYear = moment().startOf('year');
  //   const year = 2024;

  //   if (!projectId) {
  //     const { data } = await this.operationApis.getMainProjects(token);
  //     projectIds = data.map(({ id }) => id);
  //   }

  //   for (let month = 0; month < 12; month++) {
  //     const startDate = moment()
  //       .year(year)
  //       .month(month)
  //       .startOf('month')
  //       .format('YYYY-MM-DD');
  //     const endDate = moment()
  //       .year(year)
  //       .month(month)
  //       .endOf('month')
  //       .format('YYYY-MM-DD');
  //     const monthName = moment().month(month).format('MMM, YY');

  //     const qtyQuery = this.projectSparePartRepository
  //       .createQueryBuilder('psp')
  //       .leftJoin('psp.project', 'project')
  //       .where('project.id IN (:...projectIds)', { projectIds })
  //       .leftJoin('psp.manageOrderHistories', 'manageOrderHistories')
  //       .andWhere('manageOrderHistories.quantityType = :type', {
  //         type: QuantityTypes.BORROW,
  //       })
  //       .andWhere(
  //         'DATE(manageOrderHistories.createdAt) BETWEEN :startDate AND :endDate',
  //         { startDate, endDate },
  //       )
  //       .select('SUM(manageOrderHistories.quantity)', 'totalBorrowedQuantity');

  //     const totalPriceQuery = this.projectSparePartRepository
  //       .createQueryBuilder('psp')
  //       .leftJoin('psp.project', 'project')
  //       .where('project.id IN (:...projectIds)', { projectIds })
  //       .leftJoin('psp.manageOrderHistories', 'manageOrderHistories')
  //       .andWhere(
  //         'DATE(manageOrderHistories.createdAt) BETWEEN :startDate AND :endDate',
  //         { startDate, endDate },
  //       )
  //       .select('SUM(psp.remainingQuantity * psp.price)', 'totalPrice');

  //     const { totalBorrowedQuantity } = await qtyQuery.getRawOne();
  //     const { totalPrice } = await totalPriceQuery.getRawOne();

  //     const totalCost = totalBorrowedQuantity * totalPrice;
  //     monthlyCosts.push({ month: monthName, totalCost });
  //   }
  //   await this.getCurrentYearMonthlyTotalPrice(projectIds, 2024);
  //   return {
  //     data: monthlyCosts,
  //   };
  // }

  async getCurrentYearMonthlyTotalPrice(
    projectId: string,
    token: string,
    user: User,
  ): Promise<SparePartsMonthlyCostResponse> {
    const monthlyTotals: MonthlyTotalPrice[] = [];
    let projectIds = [projectId];

    if (!projectId) {
      const data = await this.projectsService.findMasterProjectsByUserId(
        user.id,
      );
      projectIds = data.map(({ project }) => project.id);

      if (!projectIds.length) {
        return { data: monthlyTotals };
      }
    }

    for (let month = 1; month <= 12; month++) {
      const startDate = moment()
        .month(month - 1)
        .startOf('month')
        .format('YYYY-MM-DD');
      const endDate = moment()
        .month(month - 1)
        .endOf('month')
        .format('YYYY-MM-DD');
      const monthName = moment()
        .month(month - 1)
        .format('MMM, YY');
      const query = this.projectSparePartRepository
        .createQueryBuilder('psp')
        .leftJoin('psp.project', 'project')
        .where('project.id IN (:...projectIds)', { projectIds })
        .leftJoin('psp.manageOrderHistories', 'manageOrderHistories')
        .andWhere(
          'DATE(manageOrderHistories.createdAt) BETWEEN :startDate AND :endDate',
          { startDate, endDate },
        )
        .groupBy('psp.id')
        .addSelect(
          'SUM(CASE WHEN manageOrderHistories.quantityType = :borrow THEN manageOrderHistories.quantity ELSE 0 END * COALESCE(manageOrderHistories.price, 0))',
          'drawTotal',
        )
        .addSelect(
          'SUM(CASE WHEN manageOrderHistories.quantityType = :restock THEN manageOrderHistories.quantity ELSE 0 END * COALESCE(manageOrderHistories.price, 0))',
          'restockTotal',
        )
        .setParameter('borrow', QuantityTypes.BORROW)
        .setParameter('restock', QuantityTypes.RESTOCK);

      const result = await query.getRawMany();
      monthlyTotals.push({
        month: monthName,
        drawTotal: result.reduce(
          (sum, result) => (sum += Number(result.drawTotal) ?? 0),
          0,
        ),
        restockTotal: result.reduce(
          (sum, result) => (sum += Number(result.restockTotal) ?? 0),
          0,
        ),
      });
    }

    return { data: monthlyTotals };
  }

  async getAllSpareParts(
    projectId: string,
    token: string,
    user: User,
  ): Promise<ProjectSparePart[]> {
    let projectIds = [projectId];

    if (!projectId) {
      const data = await this.projectsService.findMasterProjectsByUserId(
        user.id,
      );
      projectIds = data.map(({ project }) => project.id);
    }
    const spareParts = await this.projectSparePartRepository
      .createQueryBuilder('psp')
      .leftJoinAndSelect('psp.project', 'project')
      .where('project.id IN (:...projectIds)', {
        projectIds,
      })
      .leftJoinAndSelect('psp.preferredSupplier', 'preferredSupplier')
      .leftJoinAndSelect(
        'psp.projectSparePartCategory',
        'projectSparePartCategory',
      )
      .leftJoinAndSelect('psp.sparePart', 'sparePart')
      .leftJoinAndSelect(
        'projectSparePartCategory.sparePartCategory',
        'sparePartCategory',
      )
      .leftJoinAndSelect('psp.manageOrdersView', 'manageOrdersView')
      .getMany();

    return spareParts;
  }

  async downloadProjectSparePartsAsCsv(
    res: Response,
    projectId: string,
    token: string,
    user: User,
  ) {
    const spareParts = await this.getAllSpareParts(projectId, token, user);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="alectify_spare_parts.csv"',
    );

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'serialNumber', title: '#' },
        { id: 'status', title: 'Status' },
        { id: 'site', title: 'Site' },
        { id: 'projectSparePartCategory', title: 'Category' },
        { id: 'sparePart', title: 'Part Number' },
        { id: 'description', title: 'Description' },
        { id: 'vendor', title: 'Vendor' },
        { id: 'remainingQuantity', title: 'In-hand Qty' },
        { id: 'minimumQuantity', title: 'Min Qty' },
        { id: 'system', title: 'System' },
        { id: 'room', title: 'Room' },
        { id: 'rack', title: 'Rack' },
        { id: 'shelf', title: 'Shelf' },
        { id: 'firmwareVersion', title: 'Firmware Version' },
        { id: 'price', title: 'Price' },
        { id: 'comments', title: 'Comments' },
      ],
    });

    res.write(csvStringifier.getHeaderString());

    for (const [index, part] of spareParts.entries()) {
      let status = 'Normal';
      if (part.remainingQuantity <= part.minimumQuantity) {
        status = 'Low Inventory';
      }
      if (part.remainingQuantity <= 0) {
        status = 'Out of Stock';
      }

      const csvRecord = {
        serialNumber: index + 1,
        status,
        site: part.project.name,
        system: part.system,
        room: part.room,
        rack: part.rack,
        vendor: part.preferredSupplier.name,
        description: cleanHtmlTags(part.sparePart.description || ''),
        shelf: part.shelf,
        firmwareVersion: part.firmwareVersion,
        minimumQuantity: part.minimumQuantity,
        remainingQuantity: part.remainingQuantity,
        price: part.price,
        comments: cleanHtmlTags(part.comments || ''),
        sparePart: part.sparePart.partNumber,
        projectSparePartCategory: part.projectSparePartCategory
          ? part.projectSparePartCategory?.sparePartCategory?.category
          : '', // Access related object's property
      };
      res.write(csvStringifier.stringifyRecords([csvRecord]));
    }

    return res.end();
  }
}
