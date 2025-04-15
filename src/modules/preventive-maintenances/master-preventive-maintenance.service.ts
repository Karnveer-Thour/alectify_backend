import { Injectable } from '@nestjs/common';
import { GetAllMasterPreventiveMaintenanceResponseDto } from './dto/get-all-master-preventive-maintenance.dto';
import { MasterPreventiveMaintenancesRepository } from './repositories/master-preventive-maintenances.repository';
import { User } from 'modules/users/entities/user.entity';
import { Brackets } from 'typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { DueDateDelayFilters } from './models/due-date-filter.enum';
import { PMTypes } from './models/pm-types.enum';
import moment from 'moment';
import { Response } from 'express';
import { createObjectCsvStringifier } from 'csv-writer';
import { cleanHtmlTags } from '@common/utils/utils';
import { toArray } from 'lodash';
import { ProjectsService } from 'modules/projects/projects.service';
import { TaskCategories } from './models/task-categories.enum';

@Injectable()
export class MasterPreventiveMaintenanceService {
  constructor(
    private readonly masterPmRepository: MasterPreventiveMaintenancesRepository,
    private projectsService: ProjectsService,
  ) {}

  async findAllWithFilters(
    user: User,
    projectId: string,
    projectIds: string[],
    subProjectId: string,
    pmType: PMTypes,
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    assetId: string,
    areaId: string,
    assetName: string,
    areaName: string,
    assignees: string | string[],
    approvers: string | string[],
    teamMembers: string | string[],
    createdById: string,
    search: string,
    taskCategory: TaskCategories,
    dueDate: DueDateDelayFilters,
    options: IPaginationOptions,
  ): Promise<GetAllMasterPreventiveMaintenanceResponseDto> {
    const limit = parseInt(options.limit as string);
    const page = parseInt(options.page as string);
    const subProjectIds = await this.getSubProjectIds(user.id, projectIds);

    assignees = toArray(assignees);
    approvers = toArray(approvers);
    teamMembers = toArray(teamMembers);
    const query = this.masterPmRepository
      .createQueryBuilder('mpm')
      .leftJoinAndSelect('mpm.project', 'project')
      .leftJoinAndSelect('mpm.subProject', 'subProject')
      .leftJoinAndSelect('mpm.assets', 'assets')
      .leftJoinAndSelect('assets.asset', 'asset')
      .leftJoinAndSelect('mpm.areas', 'areas')
      .leftJoinAndSelect('areas.area', 'area')
      .leftJoinAndSelect('mpm.createdBy', 'createdBy')
      .leftJoinAndSelect('mpm.assignees', 'assignees')
      .leftJoinAndSelect('assignees.user', 'user')
      .leftJoinAndSelect('mpm.approvers', 'approvers')
      .leftJoinAndSelect('approvers.user', 'approverUser')
      .leftJoinAndSelect('mpm.teamMembers', 'teamMembers')
      .leftJoinAndSelect('teamMembers.user', 'teamMemberUser')
      .leftJoinAndSelect('mpm.team', 'team')
      .leftJoinAndSelect('team.projectTeamMembers', 'projectTeamMembers')
      .leftJoinAndSelect('projectTeamMembers.user', 'projectTeamMembersUser')
      .where('mpm.isRecurring = :isRecurring', { isRecurring: true })
      .andWhere('mpm.isActive = :isActive', { isActive: true });

    // this condition for join
    if (approvers.length) {
      query
        .leftJoin('mpm.approvers', 'findApprovers')
        .leftJoin('findApprovers.user', 'findapprover');
    }
    // this condition for join
    if (assignees.length) {
      query
        .leftJoin('mpm.assignees', 'findAssignees')
        .leftJoin('findAssignees.user', 'findassignee');
    }

    if (pmType !== ('all' as any)) {
      query.andWhere('mpm.pmType = :pmType', { pmType });
    }

    if (projectId === 'all' && subProjectId === 'all') {
      if (subProjectIds.length > 0) {
        query.andWhere('subProject.id IN (:...subProjectIds)', {
          subProjectIds,
        });
      } else {
        return {
          message: 'Get all preventive maintenances successfully',
          data: [],
          meta: {
            currentPage: page,
            itemCount: 0,
            itemsPerPage: limit,
            totalItems: 0,
            totalPages: Math.ceil(0 / limit),
          },
        };
      }
    }
    if (projectId !== 'all') {
      query.andWhere('project.id =:projectId', {
        projectId,
      });
    }
    if (subProjectId !== 'all') {
      query.andWhere('subProject.id =:subProjectId', {
        subProjectId,
      });
    }
    if (taskCategory) {
      query.andWhere('mpm.taskCategory = :taskCategory', { taskCategory });
    }
    if (dueDate) {
      const currentDate = moment().format('YYYY-MM-DD');
      const yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
      switch (dueDate) {
        case DueDateDelayFilters.ON_TIME:
          query.andWhere('mpm.dueDate >=:currentDate', {
            currentDate: `${currentDate} 00:00:00`,
          });
          break;
        case DueDateDelayFilters.SEVEN_DAYS_AGO:
          const sevenDaysAgo = moment()
            .subtract(7, 'days')
            .format('YYYY-MM-DD');
          query
            .andWhere('mpm.dueDate >=:startDate', {
              startDate: `${sevenDaysAgo} 00:00:00`,
            })
            .andWhere('mpm.dueDate <=:endDate', {
              endDate: `${yesterdayDate} 24:00:00`,
            });
          break;
        case DueDateDelayFilters.SEVEN_TO_14_DAYS_AGO:
          const fourteenDaysAgo = moment()
            .subtract(14, 'days')
            .format('YYYY-MM-DD');
          const eightDaysAgo = moment()
            .subtract(8, 'days')
            .format('YYYY-MM-DD');
          query
            .andWhere('mpm.dueDate >=:startDate', {
              startDate: `${fourteenDaysAgo} 00:00:00`,
            })
            .andWhere('mpm.dueDate <=:endDate', {
              endDate: `${eightDaysAgo} 24:00:00`,
            });
          break;
        case DueDateDelayFilters.MORE_THAN_14_DAYS_AGO:
          const fifteenDaysAgo = moment()
            .subtract(15, 'days')
            .format('YYYY-MM-DD');
          query.andWhere('mpm.dueDate <=:date', {
            date: `${fifteenDaysAgo} 24:00:00`,
          });
          break;
        default:
          break;
      }
    }
    if (teamMembers.length) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('projectTeamMembersUser.id IN (:...teamMembers)', {
            teamMembers,
          }).orWhere('teamMemberUser.id IN (:...teamMembers)', {
            teamMembers,
          });

          if (createdById) {
            qb.orWhere('createdBy.id = :createdById', { createdById });
          }
        }),
      );
    } else {
      if (assignees.length || approvers.length || createdById) {
        query.andWhere(
          new Brackets((qb) => {
            if (assignees.length) {
              qb.orWhere('findassignee.id IN (:...assignees)', { assignees });
            }
            if (approvers.length) {
              qb.orWhere('findapprover.id IN (:...approvers)', { approvers });
            }
            if (createdById) {
              qb.orWhere('createdBy.id = :createdById', { createdById });
            }
          }),
        );
      }
    }
    if (search) {
      query
        // .leftJoin('mpm.assets', 'findAssets')
        // .leftJoin('findAssets.asset', 'findAsset')
        // .leftJoin('mpm.areas', 'findAreas')
        // .leftJoin('findAreas.area', 'findArea')
        .andWhere(
          new Brackets((qb) => {
            qb.where('project.name ILIKE :search', {
              search: `%${search}%`,
            })
              .orWhere('subProject.name ILIKE :search', {
                search: `%${search}%`,
              })
              // .orWhere('findArea.name ILIKE :search', {
              //   search: `%${search}%`,
              // })
              // .orWhere('findAsset.name ILIKE :search', {
              //   search: `%${search}%`,
              // })
              .orWhere('mpm.workTitle ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('mpm.frequency_type::text ILIKE :search', {
                search: `%${search}%`,
              });
          }),
        );
    }
    if (orderField && orderBy) {
      query.addOrderBy(`mpm.${orderField}`, orderBy);
    } else {
      query.addOrderBy('mpm.dueDate', 'ASC');
    }
    const skipItems = (page - 1) * limit;
    const [data, count] = await query
      .skip(skipItems)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Get all master preventive maintenances successfully',
      data: data,
      meta: {
        currentPage: page,
        itemCount: data.length,
        itemsPerPage: limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findAll(
    user: User,
    projectId: string,
    subProjectId: string,
    pmType: PMTypes,
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    assetId: string,
    areaId: string,
    assetName: string,
    areaName: string,
    isRecurring: string,
    search: string,
    dueDate: DueDateDelayFilters,
    options: IPaginationOptions,
  ): Promise<GetAllMasterPreventiveMaintenanceResponseDto> {
    const limit = parseInt(options.limit as string);
    const page = parseInt(options.page as string);
    const query = this.masterPmRepository
      .createQueryBuilder('mpm')
      .leftJoinAndSelect('mpm.project', 'project')
      .leftJoinAndSelect('mpm.subProject', 'subProject')
      .leftJoinAndSelect('mpm.assets', 'assets')
      .leftJoinAndSelect('assets.asset', 'asset')
      .leftJoinAndSelect('mpm.areas', 'areas')
      .leftJoinAndSelect('areas.area', 'area')
      .leftJoin('mpm.teamMembers', 'teamMembers')
      .leftJoin('mpm.assignees', 'assignees')
      .leftJoin('mpm.approvers', 'approvers')
      .leftJoin('mpm.team', 'team')
      .leftJoin('team.projectTeamMembers', 'projectTeamMembers')
      .where(
        new Brackets((qb) => {
          qb.orWhere('mpm.createdBy = :userId', { userId: user.id })
            .orWhere('teamMembers.user_id = :userId', { userId: user.id })
            .orWhere('assignees.user_id = :userId', { userId: user.id })
            .orWhere('approvers.user_id = :userId', { userId: user.id })
            .orWhere('projectTeamMembers.user_id = :userId', {
              userId: user.id,
            });
        }),
      )
      .andWhere('mpm.isActive = :isActive', { isActive: true });
    if (pmType) {
      query.andWhere('mpm.pmType = :pmType', { pmType });
    }
    if (projectId) {
      query.andWhere('project.id =:projectId', {
        projectId,
      });
    }
    if (subProjectId) {
      query.andWhere('subProject.id =:subProjectId', {
        subProjectId,
      });
    }
    if (isRecurring) {
      query.andWhere('mpm.isRecurring =:isRecurring', { isRecurring });
    }
    if (dueDate) {
      const currentDate = moment().format('YYYY-MM-DD');
      const yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
      switch (dueDate) {
        case DueDateDelayFilters.ON_TIME:
          query.andWhere('mpm.dueDate >=:currentDate', {
            currentDate: `${currentDate} 00:00:00`,
          });
          break;
        case DueDateDelayFilters.SEVEN_DAYS_AGO:
          const sevenDaysAgo = moment()
            .subtract(7, 'days')
            .format('YYYY-MM-DD');
          query
            .andWhere('mpm.dueDate >=:startDate', {
              startDate: `${sevenDaysAgo} 00:00:00`,
            })
            .andWhere('mpm.dueDate <=:endDate', {
              endDate: `${yesterdayDate} 24:00:00`,
            });
          break;
        case DueDateDelayFilters.SEVEN_TO_14_DAYS_AGO:
          const fourteenDaysAgo = moment()
            .subtract(14, 'days')
            .format('YYYY-MM-DD');
          const eightDaysAgo = moment()
            .subtract(8, 'days')
            .format('YYYY-MM-DD');
          query
            .andWhere('mpm.dueDate >=:startDate', {
              startDate: `${fourteenDaysAgo} 00:00:00`,
            })
            .andWhere('mpm.dueDate <=:endDate', {
              endDate: `${eightDaysAgo} 24:00:00`,
            });
          break;
        case DueDateDelayFilters.MORE_THAN_14_DAYS_AGO:
          const fifteenDaysAgo = moment()
            .subtract(15, 'days')
            .format('YYYY-MM-DD');
          query.andWhere('mpm.dueDate <=:date', {
            date: `${fifteenDaysAgo} 24:00:00`,
          });
          break;
        default:
          break;
      }
    }
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('project.name ILIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('subProject.name ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('pm.workId ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('mpm.workTitle ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('mpm.frequency_type::text ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }
    if (orderField && orderBy) {
      query.addOrderBy(`mpm.${orderField}`, orderBy);
    } else {
      query.addOrderBy('mpm.createdAt', 'DESC');
    }

    const skipItems = (page - 1) * limit;
    const [data, count] = await query
      .skip(skipItems)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Get all master preventive maintenances successfully',
      data: data,
      meta: {
        currentPage: page,
        itemCount: data.length,
        itemsPerPage: limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async downloadMasterWOAsCsv(
    user: User,
    projectId: string,
    isRecurring,
    res: Response,
  ) {
    const query = this.masterPmRepository
      .createQueryBuilder('mpm')
      .leftJoinAndSelect('mpm.project', 'project')
      .leftJoinAndSelect('mpm.subProject', 'subProject')
      .leftJoinAndSelect('mpm.assets', 'assets')
      .leftJoinAndSelect('assets.asset', 'asset')
      .leftJoinAndSelect('mpm.areas', 'areas')
      .leftJoinAndSelect('areas.area', 'area')
      .leftJoin('mpm.teamMembers', 'teamMembers')
      .leftJoin('mpm.assignees', 'assignees')
      .leftJoin('mpm.approvers', 'approvers')
      .leftJoin('mpm.team', 'team')
      .leftJoin('team.projectTeamMembers', 'projectTeamMembers')
      .where('mpm.isActive = :isActive', { isActive: true });

    if (projectId) {
      query.andWhere('project.id =:projectId', {
        projectId,
      });
    }
    if (isRecurring === 'true') {
      query.andWhere('mpm.isRecurring =:isRecurring', { isRecurring });
    }
    const data = await query.addOrderBy('mpm.createdAt', 'ASC').getMany();
    const fileName = `recurring-wo-${data[0].project.name}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'createdAt', title: 'createdAt' },
        { id: 'workTitle', title: 'workTitle' },
        { id: 'detail', title: 'detail' },
        { id: 'dueDate', title: 'dueDate' },
        { id: 'asset_no', title: 'asset #' },
        { id: 'assetType', title: 'assetType' },
        { id: 'assetNames', title: 'assetNames' },
        { id: 'isRecurring', title: 'isRecurring' },
        { id: 'frequencyType', title: 'frequencyType' },
        { id: 'frequency', title: 'frequency' },
        { id: 'dayType', title: 'dayType' },
        { id: 'date', title: 'date' },
        { id: 'week', title: 'week' },
        { id: 'day', title: 'day' },
        { id: 'taskCategory', title: 'taskCategory' },
        { id: 'priority', title: 'priority' },
        { id: 'site', title: 'site' },
        { id: 'assetCategory', title: 'assetCategory' },
        { id: 'ID', title: 'ID' },
      ],
    });

    res.write(csvStringifier.getHeaderString());
    for (const [index, wo] of data.entries()) {
      const assets = [...(wo.assets as any), ...(wo.areas as any)];
      const assetNames = assets
        .map((obj) => `${obj?.asset?.name ?? obj?.area?.name}`)
        .join(', \n');
      const createdAt = new Date(wo.createdAt);
      const dueDate = new Date(wo.dueDate);
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      const csvRecord = {
        createdAt: `${monthNames[createdAt.getMonth()]} ${String(
          createdAt.getDate(),
        ).padStart(2, '0')} ${createdAt.getFullYear()}`,
        workTitle: cleanHtmlTags(wo.workTitle),
        detail: cleanHtmlTags(wo.detail),
        dueDate: `${monthNames[dueDate.getMonth()]} ${String(
          dueDate.getDate(),
        ).padStart(2, '0')} ${dueDate.getFullYear()}`,
        asset_no: assets.length,
        assetType:
          assets.length === 0
            ? 'No Asset'
            : assets.length === 1
            ? '1 Asset'
            : `Multi Assets`,
        assetNames: assetNames,
        isRecurring: wo.isRecurring,
        frequencyType: wo.frequencyType,
        frequency: wo.frequency,
        dayType: wo.dayType,
        date: wo.dayType === 'day' ? '' : wo.date,
        week: wo.dayType === 'date' ? '' : wo.week,
        day: wo.dayType === 'date' ? '' : wo.day,
        taskCategory: wo.taskCategory,
        priority: wo.priority,
        site: wo.project.name,
        assetCategory: wo.subProject.name,
        ID: wo.id,
      };
      res.write(csvStringifier.stringifyRecords([csvRecord]));
    }

    return res.end();
  }

  private async getSubProjectIds(
    userId: string,
    projectIds: string[],
  ): Promise<string[]> {
    if (projectIds) {
      const projects =
        await this.projectsService.findByIdsMasterProjectWithSubProjects(
          projectIds,
        );
      return projects
        .map(({ subProjects }) =>
          subProjects.map((subProject) => subProject.id),
        )
        .flat(1);
    } else {
      const projects =
        await this.projectsService.findProjectsAndSubProjectByUserId(userId);
      return projects
        .map(({ project }) =>
          project.subProjects.map((subProject) => subProject.id),
        )
        .flat(1);
    }
  }
}
