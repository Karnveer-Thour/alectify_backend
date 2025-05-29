import { InjectConfig } from '@common/decorators/inject-config.decorator';
import { BaseResponseDto } from '@common/dto/base-response.dto';
import DefaultEmailTemplate from '@common/email-templates/default-email-template';
import { dateToUTC, decodeURL, enumToTile, toArray } from '@common/utils/utils';
import {
  FrontendConfig,
  FrontendConfigType,
} from '@core/frontend-configs/frontend-configs.config';
import { SendGridService } from '@core/sendgrid/sendgrid.service';
import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Queue } from 'bull';
import { isUUID } from 'class-validator';
import { Area } from 'modules/areas/entities/area.entity';
import { CommentsService } from 'modules/comments/comments.service';
import { Comment } from 'modules/comments/entities/comment.entity';
import { CommentsMessages } from 'modules/comments/models/comments-messages';
import { ContentTypes } from 'modules/comments/models/content-types';
import { NotificationsService } from 'modules/notifications/notifications.service';
import { OrganizationsService } from 'modules/organizations/organizations.service';
import { CreateProcedureDto } from 'modules/procedures/dto/create-procedure.dto';
import { ProceduresService } from 'modules/procedures/procedures.service';
import { UserFcmTokenService } from 'modules/users/services/user-fcm-token.service';
import * as moment from 'moment';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Brackets, In } from 'typeorm';
import { AreasService } from '../areas/areas.service';
import { AssetsService } from '../assets/assets.service';
import { OperationApisWrapper } from '../operation-apis/operation-apis-wrapper';
import { PreventiveMaintenanceAssigneesService } from '../preventive-maintenance-assignees/preventive-maintenance-assignees.service';
import { ProjectsService } from '../projects/projects.service';
import { User } from '../users/entities/user.entity';
import { UserTypes } from '../users/models/user-types.enum';
import { UsersService } from '../users/users.service';
import { CreatePreventiveMaintenanceResponseDto } from './dto/create-preventive-maintenance-response.dto';
import {
  CreatePreventiveMaintenanceDocumentsDto,
  CreatePreventiveMaintenanceDto,
} from './dto/create-preventive-maintenance.dto';
import { GetAllCountPreventiveMaintenanceResponseDto } from './dto/get-all-count-preventive-maintenance-response.dto';
import { GetAllPreventiveMaintenanceByDueDateV2ResponseDto } from './dto/get-all-preventive-maintenance-by-due-date-v2-response.dto';
import { GetAllPreventiveMaintenanceResponseDto } from './dto/get-all-preventive-maintenance-response.dto';
import { GetCountsByStatusPreventiveMaintenanceResponseDto } from './dto/get-counts-by-status-preventive-maintenance-response.dto';
import { GetDashboardResponseDto } from './dto/get-dashboard-preventive-maintenance-response.dto';
import { UpdatePreventiveMaintenanceDto } from './dto/update-preventive-maintenance.dto';
import { UpdateStatusPreventiveMaintenanceDto } from './dto/update-status-preventive-maintenance.dto';
import { UpdateStepStatusPreventiveMaintenanceResponseDto } from './dto/update-step-status-preventive-maintenance-response.dto';
import {
  UpdateAllStepStatusPreventiveMaintenanceDto,
  UpdateStepStatusPreventiveMaintenanceDto,
} from './dto/update-step-status-preventive-maintenance.dto';
import { MasterPreventiveMaintenances } from './entities/master-preventive-maintenances.entity';
import { PreventiveMaintenances } from './entities/preventive-maintenances.entity';
import { AssetTypes } from './models/asset-types.enum';
import { CalenderStatuses } from './models/calender-status.enum';
import { DayTypes } from './models/day-types.enum';
import { DayValues } from './models/days.enum';
import { DueDateDelayFilters } from './models/due-date-filter.enum';
import { FrequencyTypes } from './models/frequency-types.enum';
import { NotifyBefore } from './models/notify-before.enum';
import { PMIds, PMTypes } from './models/pm-types.enum';
import { Priorities } from './models/priorities.enum';
import { Statuses } from './models/status.enum';
import { WeekValues, Weeks } from './models/weeks.enum';
import { MasterPreventiveMaintenancesRepository } from './repositories/master-preventive-maintenances.repository';
import { PreventiveMaintenancesRepository } from './repositories/preventive-maintenances.repository';
import { PreventiveMaintenanceApproversService } from 'modules/preventive-maintenance-approvers/preventive-maintenance-approvers.service';
import { FilesUploadService } from 'modules/files-upload/files-upload.service';
import { ManageOrdersService } from 'modules/manage-orders/manage-orders.service';
import { PreventiveMaintenanceDocumentsService } from 'modules/preventive-maintenance-documents/preventive-maintenance-documents.service';
import { PreventiveMaintenanceTeamMembersService } from 'modules/preventive-maintenance-team-members/preventive-maintenance-team-members.service';
import { TaskCategories } from './models/task-categories.enum';
import {
  ClosedWorkOrdersByAssignees,
  GetClosedWorkOrdersResponseDto,
  GetClosedWorkOrdersByAssigneesResponse,
  GetPmCountsResponseDto,
} from './dto/get-pm-counts.dto';
import { AIService } from 'modules/ai/ai-service';
import { CSVToJSON } from '@common/utils/csv/csv-to-json';
import { PreventiveMaintenanceAssetsService } from 'modules/preventive-maintenance-assets/preventive-maintenance-assets.service';
import { PreventiveMaintenanceAreasService } from 'modules/preventive-maintenance-areas/preventive-maintenance-areas.service';
import { Folders } from 'modules/preventive-maintenance-documents/models/folders.enum';
import { CreatePreventiveMaintenanceDocumentDto } from 'modules/preventive-maintenance-documents/dto/create-preventive-maintenance-document.dto';
import { MasterPreventiveMaintenanceDocumentsService } from 'modules/master-preventive-maintenance-documents/master-preventive-maintenance-documents.service';
const PM_COUNT_KEYS = {
  SKIPPED: 'skipped',
  PENDING: 'pending',
  COMPLETED: 'completed',
  isrecurring: 'isRecurring',
  'IN PROGRESS': 'inProgress',
  'WAITING FOR REVIEW': 'waitingForReview',
  DENIED: 'denied',
};

@Injectable()
export class PreventiveMaintenancesService {
  constructor(
    @InjectConfig(FrontendConfig)
    private readonly frontendConfigFactory: FrontendConfigType,
    private pmRepository: PreventiveMaintenancesRepository,
    private masterPmRepository: MasterPreventiveMaintenancesRepository,
    @Inject(forwardRef(() => PreventiveMaintenanceAssigneesService))
    private pmAssigneesService: PreventiveMaintenanceAssigneesService,
    private pmApproversService: PreventiveMaintenanceApproversService,
    private pmTeamMembersService: PreventiveMaintenanceTeamMembersService,
    private usersService: UsersService,
    @Inject(forwardRef(() => PreventiveMaintenanceDocumentsService))
    private pmDocumentsService: PreventiveMaintenanceDocumentsService,
    private mpmDocumentsService: MasterPreventiveMaintenanceDocumentsService,

    private projectsService: ProjectsService,
    private areasService: AreasService,
    private assetsService: AssetsService,
    private proceduresService: ProceduresService,
    private commentsService: CommentsService,
    private userFcmTokenService: UserFcmTokenService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationService: NotificationsService,
    private organizationsService: OrganizationsService,
    private fileUploadService: FilesUploadService,
    private readonly operationApis: OperationApisWrapper,
    private readonly sendGridService: SendGridService,
    private manageOrdersService: ManageOrdersService,
    @InjectQueue('preventiveMaintenances')
    private readonly preventiveMaintenancesQueue: Queue,
    @InjectQueue('preventiveMaintenanceGpt')
    private readonly preventiveMaintenanceGptQueue: Queue,
    private aiService: AIService,
    private pmAssetsService: PreventiveMaintenanceAssetsService,
    private pmAreasService: PreventiveMaintenanceAreasService,
  ) {}

  private validateRecurringPM(
    PMDto: CreatePreventiveMaintenanceDto | UpdatePreventiveMaintenanceDto,
  ): void {
    if (PMDto.frequencyType === FrequencyTypes.MONTHLY) {
      if (!PMDto.frequency)
        throw new BadRequestException(`Frequency is required on monthly.`);
      if (!PMDto.dayType)
        throw new BadRequestException(`Day type is required on monthly.`);
      if (PMDto.dayType === 'date' && !PMDto.date)
        throw new BadRequestException(`Date is required on monthly.`);
      if (PMDto.dayType === 'day') {
        if (!PMDto.week)
          throw new BadRequestException(`Week is required on monthly.`);
        if (!PMDto.day)
          throw new BadRequestException(`Day is required on monthly.`);
      }
    }
    if (PMDto.frequencyType === FrequencyTypes.WEEKLY && !PMDto.day) {
      throw new BadRequestException(`Day is required on weekly.`);
    }
  }

  private async getSupplier(preferredSupplierId: string) {
    return isUUID(preferredSupplierId)
      ? await this.organizationsService.findOneById(preferredSupplierId)
      : await this.organizationsService.findOneByNameOrCreate(
          preferredSupplierId,
        );
  }

  async create(
    user: User,
    token: string,
    pmType: PMTypes,
    createPMDto: CreatePreventiveMaintenanceDto,
    documents: CreatePreventiveMaintenanceDocumentsDto,
  ): Promise<CreatePreventiveMaintenanceResponseDto> {
    try {
      // Validate Recurring PM Fields
      if (createPMDto.isRecurring === 'true') {
        this.validateRecurringPM(createPMDto);
      }
      // Fetch data concurrently
      const [updatedUser, project, subProject, preferredSupplier, team] =
        await Promise.all([
          this.usersService.findOneById(user.id),
          this.projectsService.findOneById(createPMDto.projectId),
          this.projectsService.findOneByIdSubProject(createPMDto.subProjectId),
          createPMDto.preferredSupplierId
            ? this.getSupplier(createPMDto.preferredSupplierId)
            : null,
          createPMDto.teamId
            ? this.projectsService.findOneProjectTeamById(createPMDto.teamId)
            : null,
        ]);

      user = updatedUser;

      const notifyBefore =
        pmType === PMTypes.PM_EXTERNAL
          ? NotifyBefore.PM_EXTERNAL
          : NotifyBefore.PM_INTERNAL;

      let procedureLibrary;
      let procedureLibrarySteps;
      let procedure;
      const procedureSteps = [];

      if (createPMDto.procedureLibraryId) {
        procedureLibrary = await this.proceduresService.findOneById(
          createPMDto.procedureLibraryId,
        );
        procedureLibrarySteps = procedureLibrary.procedureSteps;
        delete procedureLibrary.procedureSteps;
        procedureLibrarySteps.forEach((step) => {
          procedureSteps.push({
            name: step.name,
            description: step.description,
            defaultImageUrl: step.imageUrl ? decodeURL(step.imageUrl) : null,
            order: step.order,
            durationMins: null,
            comments: null,
          });
        });
        procedure = await this.proceduresService.createProcedure({
          name: procedureLibrary.name,
          projectId: procedureLibrary?.project?.id,
          comments: procedureLibrary.comments,
          fileUpload: procedureLibrary.fileUpload,
          description: procedureLibrary.description,
          procedureSteps: procedureSteps,
          jobType: procedureLibrary.jobType,
          procedureLibrary: procedureLibrary,
          reference: procedureLibrary.reference
            ? procedureLibrary.reference
            : null,
          imageUrl: procedureLibrary.imageUrl
            ? decodeURL(procedureLibrary.imageUrl)
            : null,
        });
      }

      const pmCreate: Partial<PreventiveMaintenances> = {
        project: project,
        subProject: subProject,
        area: null,
        asset: null,
        procedure: procedure,
        workTitle: createPMDto.workTitle,
        preferredSupplier: preferredSupplier,
        contractEndDate: dateToUTC(createPMDto.contractEndDate),
        date: createPMDto.date ? Number(createPMDto.date) : null,
        day: createPMDto.day,
        week: createPMDto.week,
        dayType: createPMDto.dayType,
        detail: createPMDto.detail,
        dueDate: dateToUTC(createPMDto.dueDate),
        frequency: createPMDto.frequency ? Number(createPMDto.frequency) : null,
        isRecurring: createPMDto.isRecurring == 'true' ? true : false,
        pmType: pmType,
        notifyBefore,
        createdBy: user,
        taskCategory: createPMDto.taskCategory,
        isGeneric:
          !createPMDto?.areaIds?.length && !createPMDto?.assetIds?.length
            ? true
            : false,
        frequencyType: createPMDto?.frequencyType ?? null,
        priority: createPMDto.priority,
        team: team,
      };

      const mpmCreate = { ...pmCreate };
      delete mpmCreate.procedure;
      const masterPm = await this.masterPmRepository.save(
        new MasterPreventiveMaintenances({
          ...(mpmCreate as any),
          procedureLibrary: procedureLibrary,
        }),
      );
      const masterBulkInsertPromises = [];
      if (createPMDto?.assetIds?.length) {
        masterBulkInsertPromises.push(
          this.pmAssetsService.insertManyMaster(
            createPMDto.assetIds.map((asset) => ({
              asset,
              masterPreventiveMaintenance: masterPm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }
      if (createPMDto?.areaIds?.length) {
        masterBulkInsertPromises.push(
          this.pmAreasService.insertManyMaster(
            createPMDto.areaIds.map((area) => ({
              area,
              masterPreventiveMaintenance: masterPm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }
      if (createPMDto?.assignees?.length) {
        masterBulkInsertPromises.push(
          this.pmAssigneesService.insertManyMaster(
            createPMDto.assignees.map((user) => ({
              user,
              masterPreventiveMaintenance: masterPm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }
      if (createPMDto?.approvers?.length) {
        masterBulkInsertPromises.push(
          this.pmApproversService.insertManyMaster(
            createPMDto.approvers.map((user) => ({
              user,
              masterPreventiveMaintenance: masterPm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }
      if (createPMDto?.teamMembers?.length) {
        masterBulkInsertPromises.push(
          this.pmTeamMembersService.insertManyMaster(
            createPMDto.teamMembers.map((user) => ({
              user,
              masterPreventiveMaintenance: masterPm.id,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }
      await Promise.all(masterBulkInsertPromises);
      pmCreate.workId = await this.getWorkId(pmType, subProject.id);
      const pm = await this.pmRepository.save(
        new PreventiveMaintenances({
          masterPreventiveMaintenance: masterPm,
          ...pmCreate,
        }),
      );

      const createdType =
        pm.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
        pm.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
          ? pm.taskCategory
          : 'TASK';
      const messageText = CommentsMessages.CREATED.replace(
        '{type}',
        enumToTile(createdType),
      );
      const bulkInsertPromises: Promise<any>[] = [
        this.commentsService.create({
          referenceId: pm.id,
          subProject: pm.subProject.id,
          sentBy: pm.createdBy.id,
          text: messageText,
          contentType: ContentTypes.TEXT,
          referenceType: pm.pmType,
          s3Key: null,
          fileName: null,
          isSystemGenerated: true,
        }),
      ];

      if (createPMDto?.assetIds?.length) {
        bulkInsertPromises.push(
          this.pmAssetsService.insertMany([
            ...createPMDto.assetIds.map((asset) => ({
              asset,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ]),
        );
      }
      if (createPMDto?.areaIds?.length) {
        bulkInsertPromises.push(
          this.pmAreasService.insertMany([
            ...createPMDto.areaIds.map((area) => ({
              area,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ]),
        );
      }
      if (createPMDto?.assignees?.length) {
        bulkInsertPromises.push(
          this.pmAssigneesService.insertMany([
            ...createPMDto.assignees.map((user) => ({
              user,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ]),
        );
      }
      if (createPMDto?.approvers?.length) {
        bulkInsertPromises.push(
          this.pmApproversService.insertMany([
            ...createPMDto.approvers.map((user) => ({
              user,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ]),
        );
      }
      if (createPMDto?.teamMembers?.length) {
        bulkInsertPromises.push(
          this.pmTeamMembersService.insertMany([
            ...createPMDto.teamMembers.map((user) => ({
              user,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ]),
        );
      }
      // send notficiation
      bulkInsertPromises.push(
        this.sendTaskUpdateNotificationsQueue(pm, user, messageText),
      );
      await Promise.all(bulkInsertPromises);
      let procedureObject = null;
      if (createPMDto.procedureLibraryId) {
        procedureObject = {
          name: procedureLibrary.name,
          comments: procedureLibrary.comments,
          fileUpload: procedureLibrary.fileUpload,
          description: procedureLibrary.description,
          procedureSteps: procedureSteps,
          jobType: procedureLibrary.jobType,
          procedureLibrary: procedureLibrary,
          reference: procedureLibrary.reference
            ? procedureLibrary.reference
            : null,
          imageUrl: procedureLibrary.imageUrl
            ? decodeURL(procedureLibrary.imageUrl)
            : null,
        };
      }
      const finalPromises: Promise<any>[] = [
        this.preventiveMaintenanceGptQueue.add('chatGptRequest', {
          id: pm.id,
        }),
        this.teamMembersFromDjangoAndSendEmailQueue(pm.id, 'CREATED'),
      ];

      if (createPMDto.isRecurring == 'true') {
        finalPromises.push(
          this.preventiveMaintenancesQueue.add('createOneYearPMs', {
            pm: pmCreate,
            masterPm,
            assigneeUsers: createPMDto.assignees,
            approverUsers: createPMDto.approvers,
            teamMemberUsers: createPMDto.teamMembers,
            procedure: procedureObject,
            assetIds: createPMDto?.assetIds,
            areaIds: createPMDto?.areaIds,
            existingPm: null,
          }),
        );
      }
      await Promise.all(finalPromises);
      await this.mpmDocumentsService.uploadFilesAndImagesForPMQueue(
        documents,
        user,
        token,
        masterPm,
        pm,
        createPMDto,
        false,
      );

      return {
        message: 'Preventive maintenance created successfully',
        data: pm,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(
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
    status: string | string[],
    assignees: string | string[],
    approvers: string | string[],
    teamMembers: string | string[],
    createdById: string,
    search: string,
    assetType: AssetTypes,
    taskCategory: TaskCategories,
    dueDate: DueDateDelayFilters,
    options: IPaginationOptions,
  ): Promise<GetAllPreventiveMaintenanceResponseDto> {
    try {
      const limit = parseInt(options.limit as string);
      const page = parseInt(options.page as string);
      const subProjectIds = await this.getSubProjectIds(user.id, projectIds);

      assignees = toArray(assignees);
      approvers = toArray(approvers);
      teamMembers = toArray(teamMembers);
      status = toArray(status);

      const pms = this.pmRepository
        .createQueryBuilder('pm')
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        .leftJoinAndSelect(
          'pm.masterPreventiveMaintenance',
          'masterPreventiveMaintenance',
        ) // .leftJoinAndSelect('pm.area', 'area')
        // .leftJoinAndSelect('pm.asset', 'asset')
        .leftJoinAndSelect('pm.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        .leftJoinAndSelect('pm.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        .leftJoinAndSelect('pm.procedure', 'procedure')
        .loadRelationCountAndMap(
          'pm.procedureStepTotalCount',
          'procedure.procedureSteps',
          'procedureSteps',
        )
        .loadRelationCountAndMap(
          'pm.procedureStepCheckedTotalCount',
          'procedure.procedureSteps',
          'procedureSteps',
          (qb) =>
            qb.andWhere('procedureSteps.isChecked = :isChecked', {
              isChecked: true,
            }),
        )
        .leftJoinAndSelect('pm.createdBy', 'createdBy')
        .leftJoinAndSelect('pm.assignees', 'assignees')
        .leftJoinAndSelect('assignees.user', 'user')
        .leftJoinAndSelect('pm.approvers', 'approvers')
        .leftJoinAndSelect('approvers.user', 'approverUser')
        .loadRelationCountAndMap(
          'pm.documents',
          'pm.documents',
          'documents',
          (qb) =>
            qb
              .andWhere('documents.isActive = :isActive', {
                isActive: true,
              })
              .andWhere(`documents.folder != '${Folders.ACTIVITY}'`),
        )
        .loadRelationCountAndMap(
          'masterPreventiveMaintenance.files',
          'masterPreventiveMaintenance.files',
          'files',
          (qb) =>
            qb.andWhere('files.isActive = :isActive', {
              isActive: true,
            }),
        )
        .loadRelationCountAndMap('pm.comments', 'pm.comments');
      // this condition for join
      if (teamMembers.length) {
        pms
          .leftJoin('pm.teamMembers', 'teamMembers')
          .leftJoin('teamMembers.user', 'teamMemberUser')
          .leftJoin('pm.team', 'team')
          .leftJoin('team.projectTeamMembers', 'projectTeamMembers')
          .leftJoin('projectTeamMembers.user', 'projectTeamMembersUser');
      }
      // this condition for join
      if (approvers.length) {
        pms
          .leftJoin('pm.approvers', 'findApprovers')
          .leftJoin('findApprovers.user', 'findapprover');
      }
      // this condition for join
      if (assignees.length) {
        pms
          .leftJoin('pm.assignees', 'findAssignees')
          .leftJoin('findAssignees.user', 'findassignee');
      }
      pms.where('pm.is_future =:isFuture', { isFuture: false });
      if (pmType !== ('all' as any)) {
        pms.andWhere('pm.pmType = :pmType', { pmType });
      }
      if (projectId === 'all' && subProjectId === 'all') {
        if (subProjectIds.length > 0) {
          pms.andWhere('subProject.id IN (:...subProjectIds)', {
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
        pms.andWhere('project.id =:projectId', {
          projectId,
        });
      }
      if (subProjectId !== 'all') {
        pms.andWhere('subProject.id =:subProjectId', {
          subProjectId,
        });
      } 
      if (status) {
        pms.andWhere('pm.status IN (:...status)', {
          status,
        });
      }
      if (taskCategory) {
        pms.andWhere('pm.taskCategory = :taskCategory', { taskCategory });
      }
      if (dueDate) {
        const currentDate = moment().format('YYYY-MM-DD');
        const yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        switch (dueDate) {
          case DueDateDelayFilters.ON_TIME:
            pms.andWhere('pm.dueDate >=:currentDate', {
              currentDate: `${currentDate} 00:00:00`,
            });
            break;
          case DueDateDelayFilters.SEVEN_DAYS_AGO:
            const sevenDaysAgo = moment()
              .subtract(7, 'days')
              .format('YYYY-MM-DD');
            pms
              .andWhere('pm.dueDate >=:startDate', {
                startDate: `${sevenDaysAgo} 00:00:00`,
              })
              .andWhere('pm.dueDate <=:endDate', {
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
            pms
              .andWhere('pm.dueDate >=:startDate', {
                startDate: `${fourteenDaysAgo} 00:00:00`,
              })
              .andWhere('pm.dueDate <=:endDate', {
                endDate: `${eightDaysAgo} 24:00:00`,
              });
            break;
          case DueDateDelayFilters.MORE_THAN_14_DAYS_AGO:
            const fifteenDaysAgo = moment()
              .subtract(15, 'days')
              .format('YYYY-MM-DD');
            pms.andWhere('pm.dueDate <=:date', {
              date: `${fifteenDaysAgo} 24:00:00`,
            });
            break;
          default:
            break;
        }
      }
      // if (areaName) {
      //   pms.andWhere('area.name ILIKE :areaName', {
      //     areaName: `%${areaName}%`,
      //   });
      // }
      // if (assetName) {
      //   pms.andWhere('asset.name ILIKE :assetName', {
      //     assetName: `%${assetName}%`,
      //   });
      // }
      // if (assetType === AssetTypes.ASSET) {
      //   pms.andWhere('pm.asset IS NOT NULL');
      // }
      // if (assetType === AssetTypes.ASSET_PACKAGE) {
      //   pms.andWhere('pm.area IS NOT NULL');
      // }
      if (teamMembers.length) {
        pms.andWhere(
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
          pms.andWhere(
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
        pms
          // .leftJoin('pm.assets', 'findAssets')
          // .leftJoin('findAssets.asset', 'findAsset')
          // .leftJoin('pm.areas', 'findAreas')
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
                .orWhere('pm.workId ILIKE :search', {
                  search: `%${search}%`,
                })
                .orWhere('pm.workTitle ILIKE :search', {
                  search: `%${search}%`,
                })
                .orWhere('pm.frequency_type::text ILIKE :search', {
                  search: `%${search}%`,
                });
            }),
          );
      }
      if (orderField && orderBy) {
        pms.addOrderBy(`pm.${orderField}`, orderBy);
      } else {
        pms.addOrderBy('pm.dueDate', 'ASC');
      }
      const skipItems = (page - 1) * limit;
      const [data, count] = await pms
        .skip(skipItems)
        .take(limit)
        .getManyAndCount();

      return {
        message: 'Get all preventive maintenances successfully',
        data: data,
        meta: {
          currentPage: page,
          itemCount: data.length,
          itemsPerPage: limit,
          totalItems: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async updateMany(ids, data) {
    return await this.pmRepository.update(
      {
        id: In(ids),
      },
      data,
    );
  }

  async updateById(id, data) {
    return await this.pmRepository.update(
      {
        id,
      },
      data,
    );
  }

  async updateManyMasterPm(ids, data) {
    return await this.masterPmRepository.update(
      {
        id: In(ids),
      },
      data,
    );
  }

  async updatePMByMasterId(masterId, data) {
    return await this.pmRepository.update(
      {
        masterPreventiveMaintenance: masterId,
      },
      data,
    );
  }

  async findOne(id: string) {
    try {
      const [pm, sparePartsUsed] = await Promise.all([
        this.pmRepository.findOneWithoutMaster(id),
        this.manageOrdersService.getPmSparePartOrdersHistorySummary(id),
      ]);

      if (!pm) {
        throw new NotFoundException('Preventive Maintenance not found');
      }

      // Calculate delay status
      const daysDifference = moment(pm.dueDate).utc().diff(dateToUTC(), 'days');
      const isDelayed = daysDifference < 0;

      // Assign event status
      pm['eventStatus'] = this.getEventStatus(pm, isDelayed);

      return {
        message: 'Get preventive maintenance successfully',
        data: {
          ...pm,
          procedureLibraryId: pm.procedure?.procedureLibrary?.id,
          masterPreventiveMaintenance: {
            ...pm.masterPreventiveMaintenance,
            procedure: pm.masterPreventiveMaintenance?.procedureLibrary,
            procedureLibraryId:
              pm.masterPreventiveMaintenance?.procedureLibrary?.id,
          },
          sparePartsUsed,
        },
      };
    } catch (error) {
      console.error('Error in findOne:', error);
      throw error;
    }
  }

  // Helper function to determine event status
  private getEventStatus(pm: any, isDelayed: boolean) {
    const { status, pmType, reviewedAt, completedAt, dueDate } = pm;

    if (isDelayed) {
      if (
        [
          Statuses.PENDING,
          Statuses.IN_PROGRESS,
          Statuses.WAITING_FOR_REVIEW,
          Statuses.DENIED,
        ].includes(status)
      ) {
        return CalenderStatuses.DELAYED;
      }
      if (status === Statuses.COMPLETED) {
        return moment(dueDate).diff(
          pmType === PMTypes.PM_EXTERNAL ? reviewedAt : completedAt,
        ) < 0
          ? CalenderStatuses.DELAYED_COMPLETED
          : CalenderStatuses.ON_TIME_COMPLETED;
      }
      if (status === Statuses.SKIPPED) {
        return CalenderStatuses.SKIPPED;
      }
    } else {
      if (
        [
          Statuses.PENDING,
          Statuses.IN_PROGRESS,
          Statuses.WAITING_FOR_REVIEW,
          Statuses.DENIED,
        ].includes(status)
      ) {
        return CalenderStatuses.PENDING;
      }
      if (status === Statuses.COMPLETED) {
        return CalenderStatuses.ON_TIME_COMPLETED;
      }
      if (status === Statuses.SKIPPED) {
        return CalenderStatuses.SKIPPED;
      }
    }

    return null;
  }

  async findOneMaster(id: string) {
    try {
      const [pm, sparePartsUsed] = await Promise.all([
        this.pmRepository.findOneMasterPmById(id),
        this.manageOrdersService.getPmSparePartOrdersHistorySummary(id),
      ]);

      return {
        message: 'Get preventive maintenance successfully',
        data: {
          ...pm,
          masterPreventiveMaintenance: {
            ...pm.masterPreventiveMaintenance,
            procedure: pm.masterPreventiveMaintenance?.procedureLibrary,
            procedureLibraryId:
              pm.masterPreventiveMaintenance?.procedureLibrary?.id,
          },
          sparePartsUsed,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    user,
    id: string,
    updatePMDto: UpdatePreventiveMaintenanceDto,
    token: string,
    documents: CreatePreventiveMaintenanceDocumentsDto,
  ): Promise<CreatePreventiveMaintenanceResponseDto> {
    try {
      if (updatePMDto.changeAllFuturePM === 'true') {
        this.validateRecurringPM(updatePMDto);
      }
      if (updatePMDto.dayType === 'date') {
        updatePMDto.week = null;
        updatePMDto.day = null;
      }
      if (updatePMDto.dayType === 'day') {
        updatePMDto.date = null;
      }
      const isExist = await this.findOneById(id);
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      if (isExist.isReopened && updatePMDto.changeAllFuturePM == 'true') {
        throw new BadRequestException(
          'You cannot update reopen Preventive maintenance.',
        );
      }
      isExist.imageUrl = isExist.imageUrl ? decodeURL(isExist.imageUrl) : null;

      const libPromises: Promise<any>[] = [
        this.usersService
          .findOneById(user.id)
          .then((updatedUser) => (user = updatedUser)),
      ];

      // Handle preferred supplier
      let preferredSupplier = null;
      if (updatePMDto.preferredSupplierId) {
        const supplierPromise = updatePMDto.preferredSupplierId
          ? this.getSupplier(updatePMDto.preferredSupplierId)
          : null;
        libPromises.push(
          supplierPromise.then((supplier) => (preferredSupplier = supplier)),
        );
      }

      // Handle team
      let team = null;
      if (updatePMDto.teamId) {
        const teamPromise = this.projectsService.findOneProjectTeamById(
          updatePMDto.teamId,
        );
        libPromises.push(
          teamPromise.then((resolvedTeam) => (team = resolvedTeam)),
        );
      }

      // Handle procedure
      let pr = null;
      const prPromise = this.proceduresService.findOneProcedureById(
        isExist.procedure?.id,
      );
      libPromises.push(prPromise.then((resolvedPr) => (pr = resolvedPr)));

      // Resolve all libPromises
      await Promise.all(libPromises);

      if (
        updatePMDto.procedureLibraryId === null ||
        pr?.procedureLibrary?.id !== updatePMDto.procedureLibraryId
      ) {
        if (isExist?.procedure?.id) {
          await this.proceduresService.deleteProcedure(isExist?.procedure?.id);
        }
        isExist.procedure = null;
      }
      const promises: Promise<any>[] = [];
      promises.push(
        this.pmAssetsService.createAndRemove(
          isExist.id,
          updatePMDto.assetIds ?? [],
        ),
      );
      promises.push(
        this.pmAreasService.createAndRemove(
          isExist.id,
          updatePMDto.areaIds ?? [],
        ),
      );
      if (updatePMDto.assignees?.length) {
        promises.push(
          this.pmAssigneesService.createAndRemove(
            isExist.id,
            updatePMDto.assignees,
          ),
        );
      }
      promises.push(
        this.pmApproversService.createAndRemove(
          isExist.id,
          updatePMDto?.approvers ?? [],
        ),
      );

      promises.push(
        this.pmTeamMembersService.createAndRemove(
          isExist.id,
          updatePMDto.teamMembers ?? [],
        ),
      );
      if (promises.length) {
        await Promise.all(promises);
      }
      const currentPMs = await this.pmRepository.findCurrentPMsByMasterPMId(
        isExist.masterPreventiveMaintenance.id,
      );

      if (
        updatePMDto.procedureLibraryId != null &&
        pr?.procedureLibrary?.id !== updatePMDto.procedureLibraryId
      ) {
        const procedureLibrary = await this.proceduresService.findOneById(
          updatePMDto.procedureLibraryId,
        );
        const procedureSteps = [];
        procedureLibrary.procedureSteps.forEach((step) => {
          procedureSteps.push({
            name: step.name,
            description: step.description,
            defaultImageUrl: step.imageUrl ? decodeURL(step.imageUrl) : null,
            order: step.order,
            durationMins: null,
            comments: null,
          });
        });
        const procedure = {
          name: procedureLibrary.name,
          projectId: procedureLibrary?.project?.id,
          comments: procedureLibrary.comments,
          fileUpload: procedureLibrary.fileUpload,
          description: procedureLibrary.description,
          procedureSteps: procedureSteps,
          jobType: procedureLibrary.jobType,
          procedureLibrary: procedureLibrary,
          reference: procedureLibrary.reference
            ? procedureLibrary.reference
            : '',
          imageUrl: procedureLibrary.imageUrl
            ? decodeURL(procedureLibrary.imageUrl)
            : null,
        };
        const newProcedure = await this.proceduresService.createProcedure(
          procedure,
        );
        delete newProcedure.procedureLibrary;
        isExist.procedure = newProcedure;
        // }
      }

      const isExistCopy = { ...isExist };
      delete isExistCopy.areas;
      delete isExistCopy.assets;
      const pm = {
        ...isExistCopy,
        workTitle: updatePMDto.workTitle,
        detail: updatePMDto.detail,
        contractEndDate: updatePMDto.contractEndDate,
        frequencyType: updatePMDto.frequencyType,
        dayType: updatePMDto.dayType,
        week: updatePMDto.week,
        day: updatePMDto.day,
        priority: updatePMDto.priority,
        taskCategory: updatePMDto.taskCategory,
        dueDate: dateToUTC(updatePMDto.dueDate),
        frequency: updatePMDto.frequency ? Number(updatePMDto.frequency) : null,
        date: updatePMDto.date ? Number(updatePMDto.date) : null,
        team: team ?? null,
        preferredSupplier: preferredSupplier ?? null,
        isGeneric:
          !updatePMDto?.areaIds?.length && !updatePMDto?.assetIds?.length
            ? true
            : false,
      };
      const messageText = CommentsMessages.UPDATED.replace(
        '{type}',
        enumToTile(
          pm.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
            pm.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
            ? pm.taskCategory
            : 'TASK',
        ),
      );
      await Promise.all([
        this.pmRepository.save(pm),
        this.commentsService.create({
          referenceId: isExistCopy.id,
          subProject: isExistCopy.subProject.id,
          sentBy: user.id,
          text: messageText,
          contentType: ContentTypes.TEXT,
          referenceType: isExistCopy.pmType,
          s3Key: null,
          fileName: null,
          isSystemGenerated: true,
        }),
        this.sendTaskUpdateNotificationsQueue(pm, user, messageText),
        await this.mpmDocumentsService.uploadFilesAndImagesForPMQueue(
          documents,
          user,
          token,
          isExist.masterPreventiveMaintenance,
          isExist,
          { ...updatePMDto, isRecurring: updatePMDto.changeAllFuturePM },
          true,
        ),
      ]);
      if (updatePMDto.changeAllFuturePM == 'true') {
        let procedureLibrary;
        if (updatePMDto.procedureLibraryId != null) {
          procedureLibrary = await this.proceduresService.findOneById(
            updatePMDto.procedureLibraryId,
          );
        }
        const masterPreventiveMaintenance = {
          id: isExist.masterPreventiveMaintenance.id,
          workTitle: updatePMDto.workTitle,
          detail: updatePMDto.detail,
          contractEndDate: updatePMDto.contractEndDate,
          frequencyType: updatePMDto.frequencyType,
          dayType: updatePMDto.dayType,
          week: updatePMDto.week,
          day: updatePMDto.day,
          priority: updatePMDto.priority,
          taskCategory: updatePMDto.taskCategory,
          dueDate: dateToUTC(updatePMDto.dueDate),
          frequency: updatePMDto.frequency
            ? Number(updatePMDto.frequency)
            : null,
          date: updatePMDto.date ? Number(updatePMDto.date) : null,
          team: team ?? null,
          preferredSupplier: preferredSupplier ?? null,
          procedureLibrary: procedureLibrary ?? null,
          imageUrl: isExist.imageUrl,
          isGeneric:
            !updatePMDto?.areaIds?.length && !updatePMDto?.assetIds?.length
              ? true
              : false,
        };
        const promises: any = [
          this.masterPmRepository.save(masterPreventiveMaintenance),
        ];
        promises.push(
          this.pmAssetsService.createAndRemoveMaster(
            isExist.masterPreventiveMaintenance.id,
            updatePMDto.assetIds ?? [],
          ),
        );
        promises.push(
          this.pmAreasService.createAndRemoveMaster(
            isExist.masterPreventiveMaintenance.id,
            updatePMDto.areaIds ?? [],
          ),
        );

        if (updatePMDto.assignees?.length) {
          promises.push(
            this.pmAssigneesService.createAndRemoveMaster(
              isExist.masterPreventiveMaintenance.id,
              updatePMDto.assignees,
            ),
          );
        }
        promises.push(
          this.pmApproversService.createAndRemoveMaster(
            isExist.masterPreventiveMaintenance.id,
            updatePMDto?.approvers ?? [],
          ),
        );

        promises.push(
          this.pmTeamMembersService.createAndRemoveMaster(
            isExist.masterPreventiveMaintenance.id,
            updatePMDto.teamMembers ?? [],
          ),
        );

        if (promises.length) {
          await Promise.all(promises);
        }
        const findPms = await this.pmRepository.findFutureAndCurrentPMs(
          isExist.masterPreventiveMaintenance.id,
          currentPMs.map((cp) => cp.id),
        );
        const updatedPm = {
          workTitle: updatePMDto.workTitle,
          taskCategory: updatePMDto.taskCategory,
          priority: updatePMDto.priority,
          detail: updatePMDto.detail,
          preferredSupplierName: updatePMDto.preferredSupplierId,
          imageUrl: isExist.imageUrl,
          isGeneric:
            !updatePMDto?.areaIds?.length && !updatePMDto?.assetIds?.length
              ? true
              : false,
        };
        await this.pmRepository.update(
          {
            id: In(findPms.map(({ id }) => id)),
          },
          updatedPm,
        );

        if (
          (updatePMDto.frequencyType &&
            updatePMDto.frequencyType != isExist.frequencyType) ||
          !moment(dateToUTC(updatePMDto.dueDate)).isSame(
            dateToUTC(isExist.dueDate),
          ) ||
          (updatePMDto.dayType && updatePMDto.dayType != isExist.dayType) ||
          (updatePMDto.date && Number(updatePMDto.date) != isExist.date) ||
          (updatePMDto.day && updatePMDto.day != isExist.day) ||
          (updatePMDto.week && updatePMDto.week != isExist.week) ||
          (pr?.procedureLibrary?.id ?? null) !=
            updatePMDto.procedureLibraryId ||
          (updatePMDto.frequency &&
            Number(updatePMDto.frequency) != isExist.frequency)
        ) {
          let procedure = null;

          if (updatePMDto.procedureLibraryId != null) {
            const procedureSteps = [];
            procedureLibrary.procedureSteps.forEach((step) => {
              procedureSteps.push({
                name: step.name,
                description: step.description,
                defaultImageUrl: step.imageUrl
                  ? decodeURL(step.imageUrl)
                  : null,
                order: step.order,
                durationMins: null,
                comments: null,
              });
            });
            procedure = {
              name: procedureLibrary.name,
              projectId: procedureLibrary?.project?.id,
              comments: procedureLibrary.comments,
              fileUpload: procedureLibrary.fileUpload,
              description: procedureLibrary.description,
              procedureSteps: procedureSteps,
              jobType: procedureLibrary.jobType,
              procedureLibrary: procedureLibrary,
              reference: procedureLibrary.reference
                ? procedureLibrary.reference
                : null,
              imageUrl: procedureLibrary.imageUrl
                ? decodeURL(procedureLibrary.imageUrl)
                : null,
            };
          }

          delete pm.id;
          await Promise.all([
            this.preventiveMaintenancesQueue.add('createOneYearPMs', {
              pm: {
                ...pm,
                status: Statuses.PENDING,
                estimatedCost: null,
                estimatedHours: null,
                completedAt: null,
                completionAt: null,
                reviewedAt: null,
              },
              masterPm: masterPreventiveMaintenance,
              assigneeUsers: updatePMDto.assignees,
              approverUsers: updatePMDto.approvers,
              teamMemberUsers: updatePMDto.teamMembers,
              procedure,
              assetIds: updatePMDto.assetIds,
              areaIds: updatePMDto.areaIds,
              existingPm: isExist,
            }),
            this.preventiveMaintenanceGptQueue.add('chatGptRequest', {
              id: isExist.id,
            }),
          ]);
          // await this.createOneYearPMs(
          //   {
          //     ...pm,
          //     status: Statuses.PENDING,
          //     estimatedCost: null,
          //     estimatedHours: null,
          //     completedAt: null,
          //   },
          //   masterPreventiveMaintenance,
          //   assignees,
          //   procedure,
          //   createPMDto.assetIds,
          //   createPMDto.areaIds,
          // );
        }
      }

      return {
        message: 'Preventive maintenance updated successfully',
        data: pm,
      };
    } catch (error) {
      throw error;
    }
  }

  async reopenPM(
    user: User,
    token: string,
    id: string,
  ): Promise<CreatePreventiveMaintenanceResponseDto> {
    try {
      const isExist = await this.findOneById(id);
      if (!isExist)
        throw new NotFoundException('Preventive maintenance does not exist');

      const {
        status: oldStatus,
        completedAt,
        skippedAt,
        inProgressAt,
        pmType,
        id: pmId,
        subProject,
      } = isExist;

      Object.assign(isExist, {
        isReopened: true,
        isFuture: false,
        status: completedAt
          ? Statuses.WAITING_FOR_REVIEW
          : skippedAt
          ? Statuses.SKIPPED
          : inProgressAt
          ? Statuses.IN_PROGRESS
          : Statuses.PENDING,
        ...(oldStatus === Statuses.COMPLETED && {
          completedBy: null,
          completedAt: null,
        }),
        ...(oldStatus === Statuses.SKIPPED && {
          skippedAt: null,
          skippedBy: null,
        }),
        ...(oldStatus === Statuses.WAITING_FOR_REVIEW && {
          completionAt: null,
          reviewedBy: null,
          reviewedAt: null,
          estimatedHours: null,
          estimatedCost: null,
        }),
        ...(oldStatus === Statuses.IN_PROGRESS && {
          inProgressAt: null,
          inProgressBy: null,
        }),
        ...(oldStatus === Statuses.DENIED && {
          deniedAt: null,
          deniedBy: null,
          deniedComment: null,
        }),
      });

      const messageText = CommentsMessages.STATUS_REOPEN.replace(
        '{oldStatus}',
        enumToTile(oldStatus),
      ).replace('{currentStatus}', enumToTile(isExist.status));

      await Promise.all([
        this.commentsService.create({
          referenceId: pmId,
          subProject: subProject.id,
          sentBy: user.id,
          text: messageText,
          contentType: ContentTypes.TEXT,
          referenceType: pmType,
          s3Key: null,
          fileName: null,
          isSystemGenerated: true,
        }),
        this.sendTaskUpdateNotificationsQueue(isExist, user, messageText),
      ]);

      const updatedPm = await this.pmRepository.save(isExist);

      return {
        message: 'Preventive maintenance updated successfully',
        data: updatedPm,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(
    user: User,
    token: string,
    id: string,
    status: Statuses,
    {
      date,
      estimatedHours,
      estimatedCost,
      commentId,
    }: UpdateStatusPreventiveMaintenanceDto,
  ): Promise<CreatePreventiveMaintenanceResponseDto> {
    try {
      const isExist = await this.findOneById(id);
      isExist.imageUrl = isExist.imageUrl ? decodeURL(isExist.imageUrl) : null;
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      if (status === Statuses.COMPLETED && isExist.completedAt) {
        throw new BadRequestException(
          'Preventive maintenance already completed',
        );
      }
      if (status === Statuses.SKIPPED && isExist.skippedAt) {
        throw new BadRequestException('Preventive maintenance already skipped');
      }
      if (
        status === Statuses.WAITING_FOR_REVIEW &&
        isExist.status === Statuses.WAITING_FOR_REVIEW &&
        isExist.reviewedAt
      ) {
        throw new BadRequestException(
          'Preventive maintenance already submitted review',
        );
      }
      if (
        status === Statuses.IN_PROGRESS &&
        isExist.status === Statuses.IN_PROGRESS &&
        isExist.inProgressAt
      ) {
        throw new BadRequestException(
          'Preventive maintenance already in progress',
        );
      }
      if (
        status === Statuses.DENIED &&
        isExist.status === Statuses.DENIED &&
        isExist.deniedAt
      ) {
        throw new BadRequestException(
          'Preventive maintenance already in progress',
        );
      }
      const body = {
        status,
      };
      if (status === Statuses.PENDING) {
        body['inProgressAt'] = null;
        body['inProgressBy'] = null;
        body['reviewedAt'] = null;
        body['reviewedBy'] = null;
      }
      if (status === Statuses.IN_PROGRESS) {
        body['inProgressAt'] = dateToUTC(date);
        body['inProgressBy'] = user.id;
        body['reviewedAt'] = null;
        body['reviewedBy'] = null;
      }
      if (status === Statuses.WAITING_FOR_REVIEW) {
        body['estimatedHours'] = estimatedHours;
        body['estimatedCost'] = estimatedCost;
        body['completionAt'] = dateToUTC(date);
        body['reviewedAt'] = dateToUTC();
        body['reviewedBy'] = user.id;
        body['reviewComment'] = commentId;
      }
      if (status === Statuses.COMPLETED) {
        body['completedAt'] = dateToUTC();
        body['completedBy'] = user.id;
        if (estimatedHours && date && commentId) {
          body['estimatedHours'] = estimatedHours;
          body['estimatedCost'] = estimatedCost;
          body['completionAt'] = dateToUTC(date);
          body['reviewedAt'] = dateToUTC();
          body['reviewedBy'] = user.id;
          body['reviewComment'] = commentId;
        }
      }
      if (status === Statuses.SKIPPED) {
        body['skippedAt'] = dateToUTC(date);
        body['skippedBy'] = user.id;
      }
      if (status === Statuses.DENIED) {
        body['deniedAt'] = dateToUTC(date);
        body['deniedBy'] = user.id;
        body['deniedComment'] = commentId;
      }
      const createdType =
        isExist.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
        isExist.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
          ? isExist.taskCategory
          : 'TASK';
      const messageText = CommentsMessages.STATUS_CHANGED.replace(
        '{type}',
        enumToTile(createdType),
      ).replace('{status}', enumToTile(status));

      const [_i, pm] = await Promise.all([
        this.commentsService.create({
          referenceId: isExist.id,
          subProject: isExist.subProject.id,
          sentBy: user.id,
          text: messageText,
          contentType: ContentTypes.TEXT,
          referenceType: isExist.pmType,
          s3Key: null,
          fileName: null,
          isSystemGenerated: true,
        }),
        this.pmRepository.save({
          ...isExist,
          ...body,
        }),
      ]);

      if (
        isExist.isRecurring &&
        (status === Statuses.SKIPPED || status === Statuses.COMPLETED)
      ) {
        if (!isExist.isReopened) {
          await this.preventiveMaintenancesQueue.add('openNewPmAndTask', {
            pm: isExist,
            newOpen: true,
          });
        }
      }

      // sending notifications to the team members and assignee about the update
      await Promise.all([
        this.preventiveMaintenanceGptQueue.add('chatGptRequest', {
          id: pm.id,
        }),
        this.sendTaskUpdateNotificationsQueue(isExist, user, messageText), // Push notifications
        this.teamMembersFromDjangoAndSendEmailQueue(pm.id, status),
        // Email notifications
      ]);
      return {
        message: 'Preventive maintenance updated successfully',
        data: pm,
      };
    } catch (error) {
      throw error;
    }
  }

  async chatGptRequest(id: string) {
    try {
      const wo_data = await this.pmRepository
        .createQueryBuilder('pm')
        .select([
          'pm.createdAt',
          'pm.updatedAt',
          'pm.workId',
          'pm.workTitle',
          'pm.pmType',
          'pm.status',
          'pm.priority',
          'pm.completionAt',
          'pm.completedAt',
          'pm.taskCategory',
          'pm.isRecurring',
          'pm.dueDate',
          'pm.frequency',
          'pm.frequencyType',
          'pm.date',
          'pm.week',
          'pm.day',
          'pm.estimatedHours',
          'pm.estimatedCost',
          'pm.detail',
        ])
        .where('pm.id = :id', { id })
        .leftJoin('pm.project', 'project')
        .addSelect('project.name')
        .leftJoin('pm.subProject', 'subProject')
        .addSelect('subProject.name')
        // .leftJoin('pm.area', 'area')
        // .addSelect('area.name')
        // .leftJoin('pm.asset', 'asset')
        // .addSelect('asset.name')
        .leftJoinAndSelect('pm.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        .leftJoinAndSelect('pm.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        .leftJoin('pm.createdBy', 'createdBy')
        .addSelect(['createdBy.first_name', 'createdBy.last_name'])
        .leftJoin('pm.completedBy', 'completedBy')
        .addSelect(['completedBy.first_name', 'completedBy.last_name'])
        .leftJoinAndSelect('pm.assignees', 'assignees')
        .leftJoinAndSelect('assignees.user', 'assigneeUser')
        .leftJoinAndSelect('pm.approvers', 'approvers')
        .leftJoinAndSelect('approvers.user', 'approverUser')
        .getOne();

      if (!wo_data) {
        throw new Error(`Work Order with id ${id} not found`);
      }
      const assignees =
        wo_data.assignees?.map((assignee) => ({
          firstName: assignee.user.first_name,
          lastName: assignee.user.last_name,
        })) || [];

      const approvers =
        wo_data.approvers?.map((approver) => ({
          firstName: approver.user.first_name,
          lastName: approver.user.last_name,
        })) || [];

      const assets =
        wo_data.assets?.map(({ asset }) => ({
          name: asset.name,
        })) || [];

      const areas =
        wo_data.areas?.map(({ area }) => ({
          name: area.name,
        })) || [];

      const openAIMessage = this.aiService.getWorkOrderSummary({
        ...wo_data,
        assets,
        areas,
        assignees,
        approvers,
      });

      const gptMessage = await this.aiService.chatGptRequest(openAIMessage);

      if (gptMessage) {
        await this.pmRepository.update({ id }, { summary: gptMessage });
      }

      return {
        message: 'GPT Work Order summary generated successfully',
        data: { gptMessage },
      };
    } catch (error) {
      throw new Error('Failed to generate GPT Work Order summary');
    }
  }

  async findNextPMByMasterPmId(id) {
    return this.pmRepository.findNextPMByMasterPmId(id);
  }

  async findLastPMByMasterPmId(id) {
    return this.pmRepository.findLastPMByMasterPmId(id);
  }

  async openNewPmAndTask(pm, newOpen = false) {
    const getCount =
      await this.pmRepository.findCurrentPMsByMasterPMIdWithoutReopenedCounts(
        pm.masterPreventiveMaintenance.id,
        [pm.id],
      );
    if (getCount === 0) {
      // eslint-disable-next-line prefer-const
      let [nextPM, lastPM] = await Promise.all([
        this.findNextPMByMasterPmId(pm.masterPreventiveMaintenance.id),
        this.findLastPMByMasterPmId(pm.masterPreventiveMaintenance.id),
      ]);
      if (!lastPM) {
        if (newOpen) {
          const createPM = {
            masterPreventiveMaintenance: pm.masterPreventiveMaintenance,
            workId: await this.getWorkId(pm.pmType, pm.subProject.id),
            project: pm.project,
            subProject: pm.subProject,
            area: null,
            asset: null,
            procedure: pm.procedure,
            workTitle: pm.workTitle,
            preferredSupplier: pm.preferredSupplier,
            contractEndDate: pm.contractEndDate,
            date: pm.date,
            day: pm.day,
            week: pm.week,
            dayType: pm.dayType,
            detail: pm.detail,
            dueDate: this.dueDateCalculate({
              ...pm.masterPreventiveMaintenance,
              dueDate: pm.dueDate,
            }),
            frequency: pm.frequency,
            isRecurring: pm.isRecurring,
            pmType: pm.pmType,
            notifyBefore: pm.notifyBefore,
            createdBy: pm.createdBy,
            taskCategory: pm.taskCategory,
            isFuture: true,
            isGeneric: pm.isGeneric,
            frequencyType: pm.frequencyType,
            imageUrl: pm.imageUrl ? decodeURL(pm.imageUrl) : null,
            team: pm.team,
          };
          if (pm.procedure) {
            const procedureCopy: any = {
              ...pm.procedure,
              imageUrl: pm.procedure.imageUrl
                ? decodeURL(pm.procedure.imageUrl)
                : null,
              procedureSteps: pm.procedure.procedureSteps.map((sp) => ({
                name: sp.name,
                description: sp.description,
                defaultImageUrl: sp.defaultImageUrl
                  ? decodeURL(sp.defaultImageUrl)
                  : null,
                order: sp.order,
                durationMins: null,
                comments: null,
              })),
            };
            const newProcedure = await this.proceduresService.createProcedure(
              procedureCopy,
            );
            createPM.procedure = newProcedure;
          }
          const newPm = await this.pmRepository.save(
            new PreventiveMaintenances(createPM),
          );
          nextPM = nextPM ?? newPm;

          let [pmAssignees, pmApprovers, pmTeamMembers, pmAreas, pmAssets] =
            await Promise.all([
              this.pmAssigneesService.findAssigneesByMasterPmId(
                pm.masterPreventiveMaintenance,
              ) as any,
              this.pmApproversService.findApproversByMasterPMId(
                pm.masterPreventiveMaintenance,
              ) as any,
              this.pmTeamMembersService.findTeamMembersByMasterPmId(
                pm.masterPreventiveMaintenance,
              ) as any,
              this.pmAreasService.findAreasByMasterPMId(
                pm.masterPreventiveMaintenance,
              ) as any,
              this.pmAssetsService.findAssetsByPMId(
                pm.masterPreventiveMaintenance,
              ) as any,
            ]);
          pmAreas = pmAreas.map(({ area }) => area.id);
          pmAssets = pmAssets.map(({ asset }) => asset.id);
          pmAssignees = pmAssignees.map(({ user }) => user.id);
          pmApprovers = pmApprovers.map(({ user }) => user.id);
          pmTeamMembers = pmTeamMembers.map(({ user }) => user.id);
          if (pmAssets?.length) {
            await this.pmAssetsService.insertMany(
              pmAssets.map((asset) => ({
                asset,
                preventiveMaintenance: newPm.id,
                createdAt: dateToUTC(),
                updatedAt: dateToUTC(),
              })),
            );

            // await this.pmAssetsService.createMany(pm.id, pmAssets);
          }
          if (pmAreas?.length) {
            await this.pmAssetsService.insertMany(
              pmAreas.map((area) => ({
                area,
                preventiveMaintenance: newPm.id,
                createdAt: dateToUTC(),
                updatedAt: dateToUTC(),
              })),
            );
            // await this.pmAreasService.insertMany(pm.id, pmAreas);
          }
          if (pmAssignees.length) {
            await this.pmAssigneesService.insertMany(
              pmAssignees.map((user) => ({
                user,
                preventiveMaintenance: newPm.id,
                createdAt: dateToUTC(),
                updatedAt: dateToUTC(),
              })),
            );
          }

          if (pmApprovers.length) {
            // const approvers = await this.usersService.findUsersByIds(pmApprovers);
            // await this.pmApproversService.insertMany(
            //   approvers.map((user) => ({
            //     user,
            //     preventiveMaintenance: newPm,
            //     createdAt: dateToUTC(),
            //     updatedAt: dateToUTC(),
            //   })),
            // );
            await this.pmApproversService.insertMany(
              pmApprovers.map((user) => ({
                user,
                preventiveMaintenance: newPm.id,
                createdAt: dateToUTC(),
                updatedAt: dateToUTC(),
              })),
            );
          }
          if (pmTeamMembers.length) {
            // const teamMembers = await this.usersService.findUsersByIds(
            //   pmTeamMembers,
            // );
            // await this.pmTeamMembersService.insertMany(
            //   teamMembers.map((user) => ({
            //     user,
            //     preventiveMaintenance: newPm,
            //     createdAt: dateToUTC(),
            //     updatedAt: dateToUTC(),
            //   })),
            // );
            await this.pmTeamMembersService.insertMany(
              pmTeamMembers.map((user) => ({
                user,
                preventiveMaintenance: newPm.id,
                createdAt: dateToUTC(),
                updatedAt: dateToUTC(),
              })),
            );
          }
        }
      }
      if (nextPM) {
        const createdType =
          nextPM.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
          nextPM.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
            ? nextPM.taskCategory
            : 'TASK';
        await Promise.all([
          this.pmRepository.save({
            id: nextPM.id,
            isFuture: false,
          }),
          this.preventiveMaintenanceGptQueue.add('chatGptRequest', {
            id: nextPM.id,
          }),
          this.masterPmRepository.save({
            id: pm.masterPreventiveMaintenance.id,
            dueDate: nextPM.dueDate,
          }),
          this.commentsService.create({
            referenceId: nextPM.id,
            subProject: nextPM.subProject.id,
            sentBy: nextPM.createdBy.id,
            text: CommentsMessages.CREATED.replace(
              '{type}',
              enumToTile(createdType),
            ),
            contentType: ContentTypes.TEXT,
            referenceType: nextPM.pmType,
            s3Key: null,
            fileName: null,
            isSystemGenerated: true,
          }),
        ]);
      }
    }
  }

  async findOneWithAssignees(pmId: string) {
    return await this.pmRepository.findOneWithAssignees(pmId);
  }

  async sendTaskUpdateNotificationsQueue(pm, user: User, messageText: string) {
    return await this.preventiveMaintenancesQueue.add(
      'sendTaskUpdateNotifications',
      {
        pm,
        user,
        messageText,
      },
    );
  }
  async sendTaskUpdateNotifications(pm, user: User, messageText: string) {
    try {
      pm = await this.pmRepository.findOneWithAssignees(pm.id);
      const { pmType, workId, workTitle, area, asset } = pm;
      const teamMembers = await this.getTeamMembersWithExternalAssignees(pm);
      const teamMemberIds = teamMembers?.map(({ id }) => id);
      let deviceIds = [];
      if (teamMemberIds?.length > 0) {
        deviceIds = await this.userFcmTokenService.findFcmTokensByUserIds(
          teamMemberIds,
        );
      }

      if (!deviceIds?.length) return;
      const requestUser = `${user.first_name} ${user.last_name}`;
      const message = `${requestUser} ${messageText}`;

      const notification = {
        workId,
        workTitle,
        type: pmType,
        // areaId: area?.id || '',
        // assetId: asset?.id || '',
        // assetName: asset?.name || '',
        // assetPackageName: area?.name || '',
        userId: user.id,
      };

      await Promise.all([
        this.notificationService.createPmNotification(
          // saving notifications in the db
          pm,
          messageText,
          user.id,
          true,
          teamMembers,
        ),
        this.notificationService.sendNotificationToMultipleDevices(
          // sending push notifications to the devices
          deviceIds,
          message,
          notification,
        ),
      ]);
    } catch (error) {
      console.error('Error when sending notifications: ', error);
    }
  }

  async updateStepStatus(
    user: User,
    id: string,
    token: string,
    {
      date,
      status,
      stepId,
      durationMins,
      comments,
      image,
    }: UpdateStepStatusPreventiveMaintenanceDto,
    uploadedImage: Express.Multer.File,
  ): Promise<UpdateStepStatusPreventiveMaintenanceResponseDto> {
    try {
      const isExist = await this.findOneById(id);
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      user = await this.usersService.findOneById(user.id);

      await this.proceduresService.updateStep(
        stepId,
        isExist.procedure.id,
        status,
        date,
        isExist,
        user,
        token,
        durationMins,
        comments,
        image,
        uploadedImage,
      );
      return {
        message: 'Procedure step updated successfully',
        data: isExist,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateAllStepsStatus(
    user: User,
    id: string,
    token: string,
    { status }: UpdateAllStepStatusPreventiveMaintenanceDto,
  ): Promise<UpdateStepStatusPreventiveMaintenanceResponseDto> {
    try {
      user = await this.usersService.findOneById(user.id);
      const isExist = await this.findOneById(id);
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      console.log('isExistisExist', isExist);
      await this.proceduresService.updateAllSteps(
        isExist.procedure.id,
        status,
        isExist,
        user,
        token,
      );
      return {
        message: 'Procedure step updated successfully',
        data: isExist,
      };
    } catch (error) {
      throw error;
    }
  }
  async delete(
    id: string,
    user: User,
    token: string,
  ): Promise<BaseResponseDto> {
    try {
      const isExist = await this.findOneById(id);

      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      if (isExist.isReopened) {
        throw new BadRequestException(
          'You cannot delete reopen Preventive maintenance.',
        );
      }
      const findPms = await this.pmRepository.findFutureAndCurrentPMs(
        isExist.masterPreventiveMaintenance.id,
      );

      const ids = findPms.map((fpm) => fpm.id);
      const procedureIds = findPms
        .filter((fpm) => fpm.procedure)
        .map((fpm) => fpm.procedure.id);

      const deletedType =
        isExist.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
        isExist.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
          ? isExist.taskCategory
          : 'TASK';
      const messageText = CommentsMessages.DELETED.replace(
        '{type}',
        enumToTile(deletedType),
      );
      await Promise.all([
        this.commentsService.create({
          referenceId: isExist.id,
          subProject: isExist.subProject.id,
          sentBy: user.id,
          text: messageText,
          contentType: ContentTypes.TEXT,
          referenceType: isExist.pmType,
          s3Key: null,
          fileName: null,
          isSystemGenerated: true,
        }),
        this.notificationService.deleteNotificationByPmId(ids),
        this.proceduresService.deleteProcedureManyByPm(procedureIds),
        this.pmDocumentsService.deleteMany(ids),
        this.pmAssigneesService.deleteMany(ids),
        this.pmApproversService.deleteMany(ids),
        this.pmAreasService.deleteMany(ids),
        this.pmAssetsService.deleteMany(ids),
        this.pmTeamMembersService.deleteMany(ids),
        this.manageOrdersService.deleteByPM(isExist),
      ]);
      await Promise.all([
        this.pmRepository.delete({ id: In(ids) }),
        this.masterPmRepository.update(
          { id: isExist.masterPreventiveMaintenance.id },
          {
            isActive: false,
          },
        ),
      ]);
      return {
        message: 'Preventive maintenance deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string): Promise<PreventiveMaintenances> {
    try {
      return await this.pmRepository.findOne({
        where: { id },
        relations: [
          'procedure',
          // 'procedure.procedureSteps',
          'masterPreventiveMaintenance',
          'project',
          'subProject',
          'createdBy',
          'assets',
          'assets.asset',
          'areas',
          'areas.area',
          'team',
          'preferredSupplier',
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneByIdWithoutRelations(
    id: string,
  ): Promise<PreventiveMaintenances> {
    try {
      return await this.pmRepository.findOne({
        where: { id },
        relations: ['project', 'subProject'],
      });
    } catch (error) {
      throw error;
    }
  }

  async masterFindOneById(id: string): Promise<MasterPreventiveMaintenances> {
    try {
      return await this.masterPmRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllRecurringMasterPms(): Promise<MasterPreventiveMaintenances[]> {
    try {
      return await this.masterPmRepository.findAllRecurringMasterPms();
    } catch (error) {
      throw error;
    }
  }

  async findOneByMasterPmId(id: string) {
    try {
      return await this.pmRepository.findOneByMasterPmIdWithAssignees(id);
    } catch (error) {
      throw error;
    }
  }

  async findFutureAndCurrentPMs(id: string) {
    try {
      return await this.pmRepository.findFutureAndCurrentPMs(id);
    } catch (error) {
      throw error;
    }
  }

  async createMany(
    createPMDto: CreatePreventiveMaintenanceDto[],
  ): Promise<PreventiveMaintenances[]> {
    try {
      const data = [];
      for (let i = 0; i < createPMDto.length; i++) {
        const pmCreate: Partial<PreventiveMaintenances> = {
          ...(createPMDto[i] as any),
        };
        pmCreate.workId = await this.getWorkId(
          pmCreate.pmType,
          pmCreate.subProject.id,
        );
        delete pmCreate.assignees;
        const pm = await this.pmRepository.save(
          new PreventiveMaintenances({
            ...pmCreate,
          }),
        );
        await this.masterPmRepository.save({
          id: createPMDto[i]['masterPreventiveMaintenance'],
          dueDate: createPMDto[i].dueDate,
        });
        if (createPMDto[i].assignees.length) {
          // const assigneeUsers = await this.usersService.findUsersByIds(
          //   createPMDto[i].assignees,
          // );
          // await this.pmAssigneesService.insertMany([
          //   ...assigneeUsers.map((user) => ({
          //     user,
          //     preventiveMaintenance: pm,
          //     createdAt: dateToUTC(),
          //     updatedAt: dateToUTC(),
          //   })),
          // ]);
          await this.pmAssigneesService.insertMany([
            ...createPMDto[i].assignees.map((user) => ({
              user,
              preventiveMaintenance: pm.id,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ]);
        }

        if (createPMDto[i].approvers.length) {
          // const approverUsers = await this.usersService.findUsersByIds(
          //   createPMDto[i].approvers,
          // );
          // await this.pmApproversService.insertMany([
          //   ...approverUsers.map((user) => ({
          //     user,
          //     preventiveMaintenance: pm,
          //     createdAt: dateToUTC(),
          //     updatedAt: dateToUTC(),
          //   })),
          // ]);
          await this.pmApproversService.insertMany([
            ...createPMDto[i].approvers.map((user) => ({
              user,
              preventiveMaintenance: pm.id,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ]);
        }
        if (createPMDto[i].teamMembers.length) {
          // const teamMemberUsers = await this.usersService.findUsersByIds(
          //   createPMDto[i].teamMembers,
          // );
          // await this.pmTeamMembersService.insertMany([
          //   ...teamMemberUsers.map((user) => ({
          //     user,
          //     preventiveMaintenance: pm,
          //     createdAt: dateToUTC(),
          //     updatedAt: dateToUTC(),
          //   })),
          // ]);
          await this.pmApproversService.insertMany([
            ...createPMDto[i].teamMembers.map((user) => ({
              user,
              preventiveMaintenance: pm.id,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ]);
        }

        data.push(pm);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async findAllByDueDateV2(
    user: User,
    startDate: string,
    endDate: string,
    projectId = null,
    subProjectId = null,
    global?: string,
    pmType?: string,
    isRecordExist?: string,
  ): Promise<GetAllPreventiveMaintenanceByDueDateV2ResponseDto> {
    try {
      user = global ? await this.usersService.findOneById(user.id) : user;
      const projectIds = !global
        ? (await this.projectsService.findMasterProjectsByUserId(user.id)).map(
            ({ project }) => project.id,
          )
        : [];
      if (isRecordExist === 'true') {
        const days = moment(endDate).diff(startDate, 'days');
        const data = [];
        const promises = Array.from(
          { length: days === 0 ? 1 : days },
          async (_, i) => {
            const strtDate =
              i > 0
                ? moment(startDate).add(i, 'day').format('YYYY-MM-DD')
                : startDate;
            let findOne: any = this.pmRepository
              .createQueryBuilder('pm')
              .leftJoinAndSelect('pm.project', 'project')
              .leftJoinAndSelect('pm.subProject', 'subProject')
              .where('pm.dueDate BETWEEN :startDate AND :endDate', {
                startDate: `${strtDate} 00:00:00`,
                endDate: `${strtDate} 23:59:59`,
              });

            if (pmType) {
              findOne.andWhere('pm.pmType = :pmType', { pmType });
            }

            if (projectId === 'all' && subProjectId === 'all') {
              if (global && global === 'true') {
                findOne.andWhere('subProject.branch = :branchId', {
                  branchId: user.branch.id,
                });
              } else if (projectIds.length) {
                findOne.andWhere('project.id IN (:...projectIds)', {
                  projectIds,
                });
              }
            } else {
              if (projectId && projectId !== 'all') {
                findOne.andWhere('project.id = :projectId', {
                  projectId,
                });
              }

              if (subProjectId && subProjectId !== 'all') {
                findOne.andWhere('subProject.id = :subProjectId', {
                  subProjectId,
                });
              }
            }
            if (
              projectId === 'all' &&
              subProjectId === 'all' &&
              !projectIds.length &&
              global != 'true'
            ) {
              return {
                start: `${strtDate}T00:00:00.000Z`,
                end: `${strtDate}T23:59:59.000Z`,
                isRecordExist: false,
              };
            } else {
              findOne = await findOne.getOne();
              return findOne
                ? {
                    start: findOne.dueDate,
                    end: findOne.dueDate,
                    isRecordExist: true,
                  }
                : {
                    start: `${strtDate}T00:00:00.000Z`,
                    end: `${strtDate}T23:59:59.000Z`,
                    isRecordExist: false,
                  };
            }
          },
        );
        const results = await Promise.all(promises);
        results.forEach((result) => data.push(result));
        return {
          message: 'Get all preventive maintenances successfully',
          data: data,
        };
      }
      const pmsQuery = this.pmRepository
        .createQueryBuilder('pm')
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        // .leftJoinAndSelect('pm.area', 'area')
        // .leftJoinAndSelect('pm.asset', 'asset')
        .leftJoinAndSelect('pm.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        .leftJoinAndSelect('pm.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        .where('pm.dueDate BETWEEN :startDate AND :endDate', {
          startDate: `${startDate} 00:00:00`,
          endDate: `${endDate} 23:59:59`,
        });

      if (pmType) {
        pmsQuery.andWhere('pm.pmType =:pmType', { pmType });
      }

      if (projectId === 'all' && subProjectId === 'all') {
        if (global && global === 'true') {
          pmsQuery.andWhere('subProject.branch =:branchId', {
            branchId: user.branch.id,
          });
        } else if (projectIds.length) {
          pmsQuery.andWhere('project.id IN (:...projectIds)', {
            projectIds,
          });
        }
      } else {
        if (projectId && projectId !== 'all') {
          pmsQuery.andWhere('project.id =:projectId', {
            projectId,
          });
        }
        if (subProjectId && subProjectId !== 'all') {
          pmsQuery.andWhere('subProject.id =:subProjectId', {
            subProjectId,
          });
        }
      }

      const findPms =
        projectId === 'all' &&
        subProjectId === 'all' &&
        !projectIds.length &&
        global != 'true'
          ? []
          : (await pmsQuery.orderBy('pm.dueDate', 'ASC').getMany()).map(
              (pm) => {
                const {
                  id,
                  workId,
                  workTitle,
                  dueDate,
                  status,
                  pmType,
                  project,
                  subProject,
                  assets,
                  areas,
                  completedAt,
                  reviewedAt,
                  taskCategory,
                  completionAt,
                } = pm;

                const data = {
                  id,
                  work_id: workId,
                  title: workTitle,
                  start: dueDate,
                  end: dueDate,
                  status,
                  type: pmType,
                  taskCategory,
                  master_project: [
                    {
                      id: project.id,
                      name: project.name,
                      color: project.color,
                    },
                  ],
                  sub_project: [
                    {
                      id: subProject.id,
                      name: subProject.name,
                    },
                  ],
                  asset: assets,
                  asset_package: areas,
                  completedAt,
                  completionAt,
                };

                const daysDifference = moment(dueDate)
                  .utc()
                  .diff(dateToUTC(), 'days');
                const isDelayed = daysDifference < 0;
                data['event_status'] = this.getEventStatus(pm, isDelayed);

                return data;
              },
            );
      return {
        message: 'Get all preventive maintenances successfully',
        data: findPms,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllByDueDate(
    user: User,
    startDate: string,
    endDate: string,
    projectId = null,
    subProjectId = null,
  ): Promise<GetAllPreventiveMaintenanceResponseDto> {
    try {
      const pms = this.pmRepository
        .createQueryBuilder('pm')
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        // .leftJoinAndSelect('pm.area', 'area')
        // .leftJoinAndSelect('pm.asset', 'asset')
        // .leftJoinAndMapMany(
        //   'asset.area',
        //   Area,
        //   'package_rooms',
        //   `package_rooms."id"::text = asset.packageroom_id::text`,
        // )
        .leftJoinAndSelect('pm.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        .leftJoinAndSelect('pm.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        .leftJoinAndSelect('pm.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect('pm.reviewedBy', 'reviewedBy')
        .leftJoinAndSelect('pm.deniedBy', 'deniedBy')
        .leftJoinAndSelect('pm.completedBy', 'completedBy')
        .leftJoinAndSelect('pm.skippedBy', 'skippedBy')
        .leftJoinAndSelect('pm.createdBy', 'createdBy')
        .loadRelationCountAndMap(
          'pm.documents',
          'pm.documents',
          'documents',
          (qb) =>
            qb
              .andWhere('documents.isActive = :isActive', {
                isActive: true,
              })
              .andWhere(`documents.folder != '${Folders.ACTIVITY}'`),
        )
        .loadRelationCountAndMap('pm.comments', 'pm.comments')
        .where('pm.dueDate >=:startDate', {
          startDate: `${startDate} 00:00:00`,
        })
        .andWhere('pm.dueDate <=:endDate', {
          endDate: `${endDate} 24:00:00`,
        });

      if (projectId === 'all' && subProjectId === 'all') {
        const subProjectIds = (
          await this.projectsService.findProjectsAndSubProjectByUserId(user.id)
        )
          .map(({ project }) =>
            project.subProjects.map((subProject) => subProject.id),
          )
          .flat(1);
        if (subProjectIds.length > 0) {
          pms.andWhere('subProject.id IN (:...subProjectIds)', {
            subProjectIds,
          });
        } else {
          return {
            message: 'Get all preventive maintenances successfully',
            data: [],
          };
        }
      }
      if (projectId && projectId !== 'all') {
        pms.andWhere('project.id =:projectId', {
          projectId,
        });
      }
      if (subProjectId && subProjectId !== 'all') {
        pms.andWhere('subProject.id =:subProjectId', {
          subProjectId,
        });
      }

      return {
        message: 'Get all preventive maintenances successfully',
        data: await pms.orderBy('pm.dueDate', 'ASC').getMany(),
      };
    } catch (error) {
      throw error;
    }
  }

  async findPMsByDueDateAndStatus(
    pmType: PMTypes,
    startDate: string,
    endDate: string,
    status: Statuses[],
  ): Promise<GetAllPreventiveMaintenanceResponseDto> {
    try {
      const pms = this.pmRepository
        .createQueryBuilder('pm')
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        // .leftJoinAndSelect('pm.area', 'area')
        // .leftJoinAndSelect('pm.asset', 'asset')
        // .leftJoinAndMapMany(
        //   'asset.area',
        //   Area,
        //   'package_rooms',
        //   `package_rooms."id"::text = asset.packageroom_id::text`,
        // )
        .leftJoinAndSelect('pm.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        .leftJoinAndSelect('pm.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        .leftJoinAndSelect('pm.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect('pm.reviewedBy', 'reviewedBy')
        .leftJoinAndSelect('pm.deniedBy', 'deniedBy')
        .leftJoinAndSelect('pm.completedBy', 'completedBy')
        .leftJoinAndSelect('pm.skippedBy', 'skippedBy')
        .leftJoinAndSelect('pm.createdBy', 'createdBy')
        .leftJoinAndSelect('pm.assignees', 'assignees')
        .leftJoinAndSelect('assignees.user', 'user')
        .leftJoinAndSelect('pm.teamMembers', 'teamMembers')
        .leftJoinAndSelect('teamMembers.user', 'teamMemberUser')
        .leftJoinAndSelect('pm.team', 'team')
        .leftJoinAndSelect('team.projectTeamMembers', 'projectTeamMembers')
        .leftJoinAndSelect('projectTeamMembers.user', 'projectTeamMembersUser')
        .where('pm.pm_type = :pmType', { pmType })
        .andWhere('pm.is_future =:isFuture', { isFuture: false })
        .andWhere('pm.dueDate >=:startDate', {
          startDate: `${startDate} 00:00:00`,
        })
        .andWhere('pm.dueDate <=:endDate', {
          endDate: `${endDate} 24:00:00`,
        });
      if (status) {
        pms.andWhere('pm.status IN (:...status)', {
          status,
        });
      }

      return {
        message: 'Get all preventive maintenances successfully',
        data: await pms.orderBy('pm.dueDate', 'DESC').getMany(),
      };
    } catch (error) {
      throw error;
    }
  }

  async findPMsMissedDueDate(
    pmTypes: PMTypes[],
    date: string,
    status: Statuses[],
  ): Promise<GetAllPreventiveMaintenanceResponseDto> {
    try {
      const pms = this.pmRepository
        .createQueryBuilder('pm')
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        // .leftJoinAndSelect('pm.area', 'area')
        // .leftJoinAndSelect('pm.asset', 'asset')
        // .leftJoinAndMapMany(
        //   'asset.area',
        //   Area,
        //   'package_rooms',
        //   `package_rooms."id"::text = asset.packageroom_id::text`,
        // )
        .leftJoinAndSelect('pm.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        .leftJoinAndSelect('pm.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        .leftJoinAndSelect('pm.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect('pm.reviewedBy', 'reviewedBy')
        .leftJoinAndSelect('pm.deniedBy', 'deniedBy')
        .leftJoinAndSelect('pm.completedBy', 'completedBy')
        .leftJoinAndSelect('pm.skippedBy', 'skippedBy')
        .leftJoinAndSelect('pm.createdBy', 'createdBy')
        .leftJoinAndSelect('pm.assignees', 'assignees')
        .leftJoinAndSelect('assignees.user', 'user')
        .leftJoinAndSelect('pm.teamMembers', 'teamMembers')
        .leftJoinAndSelect('teamMembers.user', 'teamMemberUser')
        .leftJoinAndSelect('pm.team', 'team')
        .leftJoinAndSelect('team.projectTeamMembers', 'projectTeamMembers')
        .leftJoinAndSelect('projectTeamMembers.user', 'projectTeamMembersUser')
        .where('pm.pm_type IN(:...pmTypes)', { pmTypes })
        .andWhere('pm.is_future =:isFuture', { isFuture: false })
        .andWhere('pm.dueDate <=:date', {
          date: `${date} 24:00:00`,
        });
      if (status.length) {
        pms.andWhere('pm.status IN (:...status)', {
          status,
        });
      }

      return {
        message: 'Get all preventive maintenances successfully',
        data: await pms.orderBy('pm.dueDate', 'DESC').getMany(),
      };
    } catch (error) {
      throw error;
    }
  }

  async findPMsMissedForAutoCronDueDate(
    pmTypes: PMTypes[],
    date: string,
    status: Statuses[],
  ): Promise<GetAllPreventiveMaintenanceResponseDto> {
    try {
      const pms = this.pmRepository
        .createQueryBuilder('pm')
        .leftJoinAndSelect(
          'pm.masterPreventiveMaintenance',
          'masterPreventiveMaintenance',
        )
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        // .leftJoinAndSelect('pm.area', 'area')
        // .leftJoinAndSelect('pm.asset', 'asset')
        .leftJoinAndSelect('pm.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        .leftJoinAndSelect('pm.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        .leftJoinAndSelect('pm.procedure', 'procedure')
        .leftJoinAndSelect('procedure.procedureSteps', 'procedureSteps')
        .leftJoinAndSelect('pm.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect('pm.createdBy', 'createdBy')
        .leftJoinAndSelect('pm.team', 'team')

        .where('pm.pm_type IN(:...pmTypes)', { pmTypes })
        .andWhere('pm.is_future =:isFuture', { isFuture: false })
        .andWhere('pm.is_recurring =:isRecurring', { isRecurring: true })
        .andWhere('pm.is_reopened =:isReopened', { isReopened: false })
        .andWhere('pm.dueDate <=:date', {
          date: `${date} 24:00:00`,
        });
      if (status.length) {
        pms.andWhere('pm.status IN (:...status)', {
          status,
        });
      }

      return {
        message: 'Get all preventive maintenances successfully',
        data: await pms.orderBy('pm.dueDate', 'DESC').getMany(),
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllByAssetId(
    assetId,
    pmType: PMTypes,
  ): Promise<GetAllPreventiveMaintenanceResponseDto> {
    try {
      const pms = await this.pmRepository
        .createQueryBuilder('pm')
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        // .leftJoinAndSelect('pm.area', 'area')
        // .leftJoinAndSelect('pm.asset', 'asset')
        // .leftJoinAndMapMany(
        //   'asset.area',
        //   Area,
        //   'package_rooms',
        //   `package_rooms."id"::text = asset.packageroom_id::text`,
        // )
        .leftJoinAndSelect('pm.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        .leftJoinAndSelect('pm.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        .leftJoinAndSelect('pm.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect('pm.reviewedBy', 'reviewedBy')
        .leftJoinAndSelect('pm.deniedBy', 'deniedBy')
        .leftJoinAndSelect('pm.completedBy', 'completedBy')
        .leftJoinAndSelect('pm.skippedBy', 'skippedBy')
        .leftJoinAndSelect('pm.createdBy', 'createdBy')
        .leftJoinAndSelect('pm.assignees', 'assignees')
        .leftJoinAndSelect('assignees.user', 'user')
        .where('pm.pm_type = :pmType', { pmType })
        .andWhere('pm.asset >=:assetId', {
          assetId,
        })
        .andWhere('pm.is_future =:isFuture', { isFuture: false })
        .orderBy('pm.dueDate', 'ASC')
        .getMany();

      return {
        message: 'Get all preventive maintenances successfully',
        data: pms,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllCountsByProjectAndSubProject(
    user: User,
    projectId: string,
    subProjectId: string,
    assignees: string | string[],
    approvers: string | string[],
    teamMembers: string | string[],
    createdById: string,
    startDate: string,
    endDate: string,
    projectIds: string[],
  ): Promise<GetAllCountPreventiveMaintenanceResponseDto> {
    try {
      let idBy;
      if (projectId === 'all' && subProjectId === 'all') {
        idBy = 'subProjectId';
      }
      if (projectId != 'all') {
        idBy = 'projectId';
      }
      if (subProjectId != 'all') {
        idBy = 'subProjectId';
      }
      const pId = idBy === 'projectId' ? projectId : subProjectId;
      const [
        extPending,
        extInProgress,
        extDenied,
        extWaitingForReview,
        extSkip,
        extComplete,
        taskPending,
        taskInProgress,
        taskDenied,
        taskWaitingForReview,
        taskSkip,
        taskComplete,
      ] = await Promise.all([
        this.getPmsCount(
          user,
          pId,
          idBy,
          PMTypes.PM_EXTERNAL,
          Statuses.PENDING,
          assignees,
          approvers,
          teamMembers,
          createdById,
          startDate,
          endDate,
          projectIds,
        ),
        this.getPmsCount(
          user,
          pId,
          idBy,
          PMTypes.PM_EXTERNAL,
          Statuses.IN_PROGRESS,
          assignees,
          approvers,
          teamMembers,
          createdById,
          startDate,
          endDate,
          projectIds,
        ),
        this.getPmsCount(
          user,
          pId,
          idBy,
          PMTypes.PM_EXTERNAL,
          Statuses.DENIED,
          assignees,
          approvers,
          teamMembers,
          createdById,
          startDate,
          endDate,
          projectIds,
        ),
        this.getPmsCount(
          user,
          pId,
          idBy,
          PMTypes.PM_EXTERNAL,
          Statuses.WAITING_FOR_REVIEW,
          assignees,
          approvers,
          teamMembers,
          createdById,
          startDate,
          endDate,
          projectIds,
        ),
        this.getPmsCount(
          user,
          pId,
          idBy,
          PMTypes.PM_EXTERNAL,
          Statuses.SKIPPED,
          assignees,
          approvers,
          teamMembers,
          createdById,
          startDate,
          endDate,
          projectIds,
        ),
        this.getPmsCount(
          user,
          pId,
          idBy,
          PMTypes.PM_EXTERNAL,
          Statuses.COMPLETED,
          assignees,
          approvers,
          teamMembers,
          createdById,
          startDate,
          endDate,
          projectIds,
        ),
        this.getPmsCount(
          user,
          pId,
          idBy,
          PMTypes.TASK,
          Statuses.PENDING,
          assignees,
          approvers,
          teamMembers,
          createdById,
          startDate,
          endDate,
          projectIds,
        ),
        this.getPmsCount(
          user,
          pId,
          idBy,
          PMTypes.TASK,
          Statuses.IN_PROGRESS,
          assignees,
          approvers,
          teamMembers,
          createdById,
          startDate,
          endDate,
          projectIds,
        ),
        this.getPmsCount(
          user,
          pId,
          idBy,
          PMTypes.TASK,
          Statuses.DENIED,
          assignees,
          approvers,
          teamMembers,
          createdById,
          startDate,
          endDate,
          projectIds,
        ),
        this.getPmsCount(
          user,
          pId,
          idBy,
          PMTypes.TASK,
          Statuses.WAITING_FOR_REVIEW,
          assignees,
          approvers,
          teamMembers,
          createdById,
          startDate,
          endDate,
          projectIds,
        ),
        this.getPmsCount(
          user,
          pId,
          idBy,
          PMTypes.TASK,
          Statuses.SKIPPED,
          assignees,
          approvers,
          teamMembers,
          createdById,
          startDate,
          endDate,
          projectIds,
        ),
        this.getPmsCount(
          user,
          pId,
          idBy,
          PMTypes.TASK,
          Statuses.COMPLETED,
          assignees,
          approvers,
          teamMembers,
          createdById,
          startDate,
          endDate,
          projectIds,
        ),
      ]);
      return {
        message: `Get all Counts preventive maintenances count successfully`,
        data: {
          pmExternal: {
            pending: extPending,
            inProgress: extInProgress,
            denied: extDenied,
            waitingForReview: extWaitingForReview,
            skipped: extSkip,
            completed: extComplete,
          },
          task: {
            pending: taskPending,
            inProgress: taskInProgress,
            denied: taskDenied,
            waitingForReview: taskWaitingForReview,
            skipped: taskSkip,
            completed: taskComplete,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getByProjectIdAndStatus(
    user: User,
    subProjectId: string,
    status: Statuses,
    assignees: string | string[],
    approvers: string | string[],
    teamMembers: string | string[],
    createdById: string,
  ): Promise<GetCountsByStatusPreventiveMaintenanceResponseDto> {
    try {
      const pmInternal = await this.getPmsCount(
        user,
        subProjectId,
        'subProjectId',
        PMTypes.PM_INTERNAL,
        status,
        assignees,
        approvers,
        teamMembers,
        createdById,
        null,
        null,
        null,
      );

      const pmExternal = await this.getPmsCount(
        user,
        subProjectId,
        'subProjectId',
        PMTypes.PM_EXTERNAL,
        status,
        assignees,
        approvers,
        teamMembers,
        createdById,
        null,
        null,
        null,
      );

      const task = await this.getPmsCount(
        user,
        subProjectId,
        'subProjectId',
        PMTypes.TASK,
        status,
        assignees,
        approvers,
        teamMembers,
        createdById,
        null,
        null,
        null,
      );
      return {
        message: `Get ${status} preventive maintenances count successfully`,
        data: {
          pmInternal,
          pmExternal,
          task,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getByAssetIdAndStatus(
    user: User,
    assetId: string,
    status: Statuses,
    assignees: string | string[],
    approvers: string | string[],
    teamMembers: string | string[],
    createdById: string,
  ): Promise<GetCountsByStatusPreventiveMaintenanceResponseDto> {
    try {
      const pmInternal = await this.getPmsCount(
        user,
        assetId,
        'assetId',
        PMTypes.PM_INTERNAL,
        status,
        assignees,
        approvers,
        teamMembers,
        createdById,
        null,
        null,
        null,
      );

      const pmExternal = await this.getPmsCount(
        user,
        assetId,
        'assetId',
        PMTypes.PM_EXTERNAL,
        status,
        assignees,
        approvers,
        teamMembers,
        createdById,
        null,
        null,
        null,
      );

      const task = await this.getPmsCount(
        user,
        assetId,
        'assetId',
        PMTypes.TASK,
        status,
        assignees,
        approvers,
        teamMembers,
        createdById,
        null,
        null,
        null,
      );

      return {
        message: `Get ${status} preventive maintenances count successfully`,
        data: {
          pmInternal,
          pmExternal,
          task,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getByAreaIdAndStatus(
    user: User,
    areaId: string,
    status: Statuses,
    assignees: string | string[],
    approvers: string | string[],
    teamMembers: string | string[],
    createdById: string,
  ): Promise<GetCountsByStatusPreventiveMaintenanceResponseDto> {
    try {
      const pmInternal = await this.getPmsCount(
        user,
        areaId,
        'areaId',
        PMTypes.PM_INTERNAL,
        status,
        assignees,
        approvers,
        teamMembers,
        createdById,
        null,
        null,
        null,
      );

      const pmExternal = await this.getPmsCount(
        user,
        areaId,
        'areaId',
        PMTypes.PM_EXTERNAL,
        status,
        assignees,
        approvers,
        teamMembers,
        createdById,
        null,
        null,
        null,
      );

      const task = await this.getPmsCount(
        user,
        areaId,
        'areaId',
        PMTypes.TASK,
        status,
        assignees,
        approvers,
        teamMembers,
        createdById,
        null,
        null,
        null,
      );

      return {
        message: `Get ${status} preventive maintenances count successfully`,
        data: {
          pmInternal,
          pmExternal,
          task,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getCount(
    user: User,
    projectId: string,
    subProjectId: string,
  ): Promise<GetPmCountsResponseDto> {
    let idBy;
    if (projectId === 'all' && subProjectId === 'all') {
      idBy = 'subProjectId';
    }
    if (projectId != 'all') {
      idBy = 'projectId';
    }
    if (subProjectId != 'all') {
      idBy = 'subProjectId';
    }
    const pId = idBy === 'projectId' ? projectId : subProjectId;
    const query = this.pmRepository
      .createQueryBuilder('pm')
      .leftJoin('pm.project', 'project')
      .leftJoin('pm.subProject', 'subProject')
      .leftJoin('pm.teamMembers', 'teamMembers')
      .leftJoin('teamMembers.user', 'teamMemberUser')
      .leftJoin('pm.team', 'team')
      .leftJoin('team.projectTeamMembers', 'projectTeamMembers')
      .leftJoin('projectTeamMembers.user', 'projectTeamMembersUser')
      .where('pm.pmType IN (:...types)', {
        types: [PMTypes.PM_EXTERNAL, PMTypes.TASK],
      })
      .andWhere('pm.is_future =:isFuture', { isFuture: false });
    if (idBy === 'projectId') {
      query.andWhere('project.id = :pId', { pId });
    }
    if (idBy === 'subProjectId') {
      if (pId != 'all') {
        query.andWhere('subProject.id =:pId', {
          pId,
        });
      }
      if (pId === 'all') {
        const subProjectIds = (
          await this.projectsService.findProjectsAndSubProjectByUserId(user.id)
        )
          .map(({ project }) =>
            project.subProjects.map((subProject) => subProject.id),
          )
          .flat(1);
        if (subProjectIds.length > 0) {
          query.andWhere('subProject.id IN (:...subProjectIds)', {
            subProjectIds,
          });
        }
      }
    }
    query.andWhere(
      new Brackets((qb) => {
        qb.orWhere('projectTeamMembersUser.id IN (:...teamMembers)', {
          teamMembers: [user.id],
        }).orWhere('teamMemberUser.id IN (:...teamMembers)', {
          teamMembers: [user.id],
        });
        qb.orWhere('pm.createdBy = :createdById', { createdById: user.id });
      }),
    );

    query
      .select([
        'pm.pmType AS type',
        'pm.taskCategory AS category',
        'pm.isRecurring AS isRecurring',
        'pm.status AS status',
        'COUNT(DISTINCT pm.id) as count', // Ensure distinct count
      ])
      .groupBy('pm.pmType')
      .addGroupBy('pm.isRecurring')
      .addGroupBy('pm.taskCategory')
      .addGroupBy('pm.status');

    const result = await query.getRawMany();

    console.log('query ==> ', result);

    const initialResponse = () => ({
      pending: 0,
      skipped: 0,
      completed: 0,
      inProgress: 0,
      denied: 0,
      recurring: 0,
      nonRecurring: 0,
      waitingForReview: 0,
    });

    const response = {
      [TaskCategories.CORRECTIVE_MAINTENANCE]: initialResponse(),
      [TaskCategories.CLEANUP]: initialResponse(),
      [TaskCategories.REPLACEMENT]: initialResponse(),
      [TaskCategories.OTHERS]: initialResponse(),
      [TaskCategories.PREVENTIVE_MAINTENANCE]: initialResponse(),
      [TaskCategories.DAMAGE]: initialResponse(),
      [TaskCategories.INSPECTION]: initialResponse(),
      [TaskCategories.SAFETY]: initialResponse(),
      [TaskCategories.TASK]: initialResponse(),
      [TaskCategories.DEFICIENCY]: initialResponse(),
    };

    result.forEach(({ type, category, status, count, isrecurring }) => {
      const statusKey = PM_COUNT_KEYS[status];

      if (category === TaskCategories.CORRECTIVE_MAINTENANCE) {
        response[TaskCategories.CORRECTIVE_MAINTENANCE][statusKey] +=
          Number(count);
        if (status != Statuses.COMPLETED && status != Statuses.SKIPPED) {
          if (isrecurring) {
            response[TaskCategories.CORRECTIVE_MAINTENANCE]['recurring'] +=
              Number(count);
          } else {
            response[TaskCategories.CORRECTIVE_MAINTENANCE]['nonRecurring'] +=
              Number(count);
          }
        }
      } else if (category === TaskCategories.CLEANUP) {
        response[TaskCategories.CLEANUP][statusKey] += Number(count);
        if (status != Statuses.COMPLETED && status != Statuses.SKIPPED) {
          if (isrecurring) {
            response[TaskCategories.CLEANUP]['recurring'] += Number(count);
          } else {
            response[TaskCategories.CLEANUP]['nonRecurring'] += Number(count);
          }
        }
      } else if (category === TaskCategories.REPLACEMENT) {
        response[TaskCategories.REPLACEMENT][statusKey] += Number(count);
        if (status != Statuses.COMPLETED && status != Statuses.SKIPPED) {
          if (isrecurring) {
            response[TaskCategories.REPLACEMENT]['recurring'] += Number(count);
          } else {
            response[TaskCategories.REPLACEMENT]['nonRecurring'] +=
              Number(count);
          }
        }
      } else if (category === TaskCategories.OTHERS) {
        response[TaskCategories.OTHERS][statusKey] += Number(count);
        if (status != Statuses.COMPLETED && status != Statuses.SKIPPED) {
          if (isrecurring) {
            response[TaskCategories.OTHERS]['recurring'] += Number(count);
          } else {
            response[TaskCategories.OTHERS]['nonRecurring'] += Number(count);
          }
        }
      } else if (category === TaskCategories.PREVENTIVE_MAINTENANCE) {
        response[TaskCategories.PREVENTIVE_MAINTENANCE][statusKey] +=
          Number(count);
        if (status != Statuses.COMPLETED && status != Statuses.SKIPPED) {
          if (isrecurring) {
            response[TaskCategories.PREVENTIVE_MAINTENANCE]['recurring'] +=
              Number(count);
          } else {
            response[TaskCategories.PREVENTIVE_MAINTENANCE]['nonRecurring'] +=
              Number(count);
          }
        }
      } else if (category === TaskCategories.DAMAGE) {
        response[TaskCategories.DAMAGE][statusKey] += Number(count);
        if (status != Statuses.COMPLETED && status != Statuses.SKIPPED) {
          if (isrecurring) {
            response[TaskCategories.DAMAGE]['recurring'] += Number(count);
          } else {
            response[TaskCategories.DAMAGE]['nonRecurring'] += Number(count);
          }
        }
      } else if (category === TaskCategories.INSPECTION) {
        response[TaskCategories.INSPECTION][statusKey] += Number(count);
        if (status != Statuses.COMPLETED && status != Statuses.SKIPPED) {
          if (isrecurring) {
            response[TaskCategories.INSPECTION]['recurring'] += Number(count);
          } else {
            response[TaskCategories.INSPECTION]['nonRecurring'] +=
              Number(count);
          }
        }
      } else if (category === TaskCategories.SAFETY) {
        response[TaskCategories.SAFETY][statusKey] += Number(count);
        if (status != Statuses.COMPLETED && status != Statuses.SKIPPED) {
          if (isrecurring) {
            response[TaskCategories.SAFETY]['recurring'] += Number(count);
          } else {
            response[TaskCategories.SAFETY]['nonRecurring'] += Number(count);
          }
        }
      } else if (category === TaskCategories.TASK) {
        response[TaskCategories.TASK][statusKey] += Number(count);
        if (status != Statuses.COMPLETED && status != Statuses.SKIPPED) {
          if (isrecurring) {
            response[TaskCategories.TASK]['recurring'] += Number(count);
          } else {
            response[TaskCategories.TASK]['nonRecurring'] += Number(count);
          }
        }
      } else if (category === TaskCategories.DEFICIENCY) {
        response[TaskCategories.DEFICIENCY][statusKey] += Number(count);
        if (status != Statuses.COMPLETED && status != Statuses.SKIPPED) {
          if (isrecurring) {
            response[TaskCategories.DEFICIENCY]['recurring'] += Number(count);
          } else {
            response[TaskCategories.DEFICIENCY]['nonRecurring'] +=
              Number(count);
          }
        }
      }
    });

    return {
      data: response,
      message: 'Get PMs counts successfully',
    };
  }

  async getClosedWorkOrders(
    projectId: string,
    user: User,
  ): Promise<GetClosedWorkOrdersResponseDto> {
    const startOfWeek = new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay()),
    );
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    const completedThisWeekQ = this.pmRepository
      .createQueryBuilder('pm')
      .leftJoin('pm.project', 'project')
      .leftJoin('pm.subProject', 'subProject')
      .leftJoin('pm.teamMembers', 'teamMembers')
      .leftJoin('teamMembers.user', 'teamMemberUser')
      .leftJoin('pm.team', 'team')
      .leftJoin('team.projectTeamMembers', 'projectTeamMembers')
      .leftJoin('projectTeamMembers.user', 'projectTeamMembersUser')
      .select('pm.taskCategory', 'category')
      .addSelect('COUNT(DISTINCT pm.id)', 'count')
      .where('pm.completedAt >= :startOfWeek', { startOfWeek })
      .andWhere('pm.pmType IN (:...types)', {
        types: [PMTypes.PM_EXTERNAL, PMTypes.TASK],
      })
      .andWhere('pm.status IN (:...status)', {
        status: [Statuses.COMPLETED, Statuses.SKIPPED],
      })
      .andWhere('pm.is_future =:isFuture', { isFuture: false });
    const completedThisMonthQ = this.pmRepository
      .createQueryBuilder('pm')
      .leftJoin('pm.project', 'project')
      .leftJoin('pm.subProject', 'subProject')
      .leftJoin('pm.teamMembers', 'teamMembers')
      .leftJoin('teamMembers.user', 'teamMemberUser')
      .leftJoin('pm.team', 'team')
      .leftJoin('team.projectTeamMembers', 'projectTeamMembers')
      .leftJoin('projectTeamMembers.user', 'projectTeamMembersUser')
      .select('pm.taskCategory', 'category')
      .addSelect('COUNT(DISTINCT pm.id)', 'count')
      .where('pm.completedAt >= :startOfMonth', { startOfMonth })
      .andWhere('pm.pmType IN (:...types)', {
        types: [PMTypes.PM_EXTERNAL, PMTypes.TASK],
      })
      .andWhere('pm.status IN (:...status)', {
        status: [Statuses.COMPLETED, Statuses.SKIPPED],
      })
      .andWhere('pm.is_future =:isFuture', { isFuture: false });
    const completedSinceInceptionQ = this.pmRepository
      .createQueryBuilder('pm')
      .leftJoin('pm.project', 'project')
      .leftJoin('pm.subProject', 'subProject')
      .leftJoin('pm.teamMembers', 'teamMembers')
      .leftJoin('teamMembers.user', 'teamMemberUser')
      .leftJoin('pm.team', 'team')
      .leftJoin('team.projectTeamMembers', 'projectTeamMembers')
      .leftJoin('projectTeamMembers.user', 'projectTeamMembersUser')
      .select('pm.taskCategory', 'category')
      .addSelect('COUNT(DISTINCT pm.id)', 'count')
      .where('pm.status IN (:...status)', {
        status: [Statuses.COMPLETED, Statuses.SKIPPED],
      })
      .andWhere('pm.pmType IN (:...types)', {
        types: [PMTypes.PM_EXTERNAL, PMTypes.TASK],
      })
      .andWhere('pm.is_future =:isFuture', { isFuture: false });
    if (!projectId) {
      const subProjectIds = (
        await this.projectsService.findProjectsAndSubProjectByUserId(user.id)
      )
        .map(({ project }) =>
          project.subProjects.map((subProject) => subProject.id),
        )
        .flat(1);
      if (subProjectIds.length > 0) {
        completedThisWeekQ.andWhere('subProject.id IN (:...subProjectIds)', {
          subProjectIds,
        });
        completedThisMonthQ.andWhere('subProject.id IN (:...subProjectIds)', {
          subProjectIds,
        });
        completedSinceInceptionQ.andWhere(
          'subProject.id IN (:...subProjectIds)',
          {
            subProjectIds,
          },
        );
      } else {
        return {
          message: 'Get closed work orders successfully',
          data: [] as any,
        };
      }
    }
    if (projectId) {
      completedThisWeekQ.andWhere('project.id =:projectId', {
        projectId,
      });
      completedThisMonthQ.andWhere('project.id =:projectId', {
        projectId,
      });
      completedSinceInceptionQ.andWhere('project.id =:projectId', {
        projectId,
      });
    }

    completedThisWeekQ
      .andWhere(
        new Brackets((qb) => {
          qb.orWhere('projectTeamMembersUser.id IN (:...teamMembers)', {
            teamMembers: [user.id],
          }).orWhere('teamMemberUser.id IN (:...teamMembers)', {
            teamMembers: [user.id],
          });
          qb.orWhere('pm.createdBy = :createdById', { createdById: user.id });
        }),
      )
      .groupBy('pm.taskCategory');
    completedThisMonthQ
      .andWhere(
        new Brackets((qb) => {
          qb.orWhere('projectTeamMembersUser.id IN (:...teamMembers)', {
            teamMembers: [user.id],
          }).orWhere('teamMemberUser.id IN (:...teamMembers)', {
            teamMembers: [user.id],
          });
          qb.orWhere('pm.createdBy = :createdById', { createdById: user.id });
        }),
      )
      .groupBy('pm.taskCategory');

    completedSinceInceptionQ
      .andWhere(
        new Brackets((qb) => {
          qb.orWhere('projectTeamMembersUser.id IN (:...teamMembers)', {
            teamMembers: [user.id],
          }).orWhere('teamMemberUser.id IN (:...teamMembers)', {
            teamMembers: [user.id],
          });
          qb.orWhere('pm.createdBy = :createdById', { createdById: user.id });
        }),
      )
      .groupBy('pm.taskCategory');
    const [completedThisWeek, completedThisMonth, completedSinceInception] =
      await Promise.all([
        completedThisWeekQ.getRawMany(),
        completedThisMonthQ.getRawMany(),
        completedSinceInceptionQ.getRawMany(),
      ]);

    const initialResponse = () => ({
      completedThisWeek: 0,
      completedThisMonth: 0,
      completedSinceInception: 0,
    });

    const result = {
      [TaskCategories.CORRECTIVE_MAINTENANCE]: initialResponse(),
      [TaskCategories.CLEANUP]: initialResponse(),
      [TaskCategories.REPLACEMENT]: initialResponse(),
      [TaskCategories.OTHERS]: initialResponse(),
      [TaskCategories.PREVENTIVE_MAINTENANCE]: initialResponse(),
      [TaskCategories.DAMAGE]: initialResponse(),
      [TaskCategories.INSPECTION]: initialResponse(),
      [TaskCategories.SAFETY]: initialResponse(),
      [TaskCategories.TASK]: initialResponse(),
      [TaskCategories.DEFICIENCY]: initialResponse(),
    };

    completedThisWeek.forEach(({ category, count }) => {
      if (category === TaskCategories.CORRECTIVE_MAINTENANCE) {
        result[TaskCategories.CORRECTIVE_MAINTENANCE].completedThisWeek +=
          Number(count);
      } else if (category === TaskCategories.CLEANUP) {
        result[TaskCategories.CLEANUP].completedThisWeek += Number(count);
      } else if (category === TaskCategories.REPLACEMENT) {
        result[TaskCategories.REPLACEMENT].completedThisWeek += parseInt(
          count,
          10,
        );
      } else if (category === TaskCategories.OTHERS) {
        result[TaskCategories.OTHERS].completedThisWeek += Number(count);
      } else if (category === TaskCategories.PREVENTIVE_MAINTENANCE) {
        result[TaskCategories.PREVENTIVE_MAINTENANCE].completedThisWeek +=
          Number(count);
      } else if (category === TaskCategories.DAMAGE) {
        result[TaskCategories.DAMAGE].completedThisWeek += Number(count);
      } else if (category === TaskCategories.INSPECTION) {
        result[TaskCategories.INSPECTION].completedThisWeek += parseInt(
          count,
          10,
        );
      } else if (category === TaskCategories.SAFETY) {
        result[TaskCategories.SAFETY].completedThisWeek += Number(count);
      } else if (category === TaskCategories.TASK) {
        result[TaskCategories.TASK].completedThisWeek += Number(count);
      } else if (category === TaskCategories.DEFICIENCY) {
        result[TaskCategories.DEFICIENCY].completedThisWeek += parseInt(
          count,
          10,
        );
      }
    });

    completedThisMonth.forEach(({ category, count }) => {
      if (category === TaskCategories.CORRECTIVE_MAINTENANCE) {
        result[TaskCategories.CORRECTIVE_MAINTENANCE].completedThisMonth +=
          Number(count);
      } else if (category === TaskCategories.CLEANUP) {
        result[TaskCategories.CLEANUP].completedThisMonth += parseInt(
          count,
          10,
        );
      } else if (category === TaskCategories.REPLACEMENT) {
        result[TaskCategories.REPLACEMENT].completedThisMonth += parseInt(
          count,
          10,
        );
      } else if (category === TaskCategories.OTHERS) {
        result[TaskCategories.OTHERS].completedThisMonth += Number(count);
      } else if (category === TaskCategories.PREVENTIVE_MAINTENANCE) {
        result[TaskCategories.PREVENTIVE_MAINTENANCE].completedThisMonth +=
          Number(count);
      } else if (category === TaskCategories.DAMAGE) {
        result[TaskCategories.DAMAGE].completedThisMonth += Number(count);
      } else if (category === TaskCategories.INSPECTION) {
        result[TaskCategories.INSPECTION].completedThisMonth += Number(count);
      } else if (category === TaskCategories.SAFETY) {
        result[TaskCategories.SAFETY].completedThisMonth += Number(count);
      } else if (category === TaskCategories.TASK) {
        result[TaskCategories.TASK].completedThisMonth += Number(count);
      } else if (category === TaskCategories.DEFICIENCY) {
        result[TaskCategories.DEFICIENCY].completedThisMonth += Number(count);
      }
    });

    completedSinceInception.forEach(({ category, count }) => {
      if (category === TaskCategories.CORRECTIVE_MAINTENANCE) {
        result[TaskCategories.CORRECTIVE_MAINTENANCE].completedSinceInception +=
          Number(count);
      } else if (category === TaskCategories.CLEANUP) {
        result[TaskCategories.CLEANUP].completedSinceInception += Number(count);
      } else if (category === TaskCategories.REPLACEMENT) {
        result[TaskCategories.REPLACEMENT].completedSinceInception +=
          Number(count);
      } else if (category === TaskCategories.OTHERS) {
        result[TaskCategories.OTHERS].completedSinceInception += Number(count);
      } else if (category === TaskCategories.PREVENTIVE_MAINTENANCE) {
        result[TaskCategories.PREVENTIVE_MAINTENANCE].completedSinceInception +=
          Number(count);
      } else if (category === TaskCategories.DAMAGE) {
        result[TaskCategories.DAMAGE].completedSinceInception += Number(count);
      } else if (category === TaskCategories.INSPECTION) {
        result[TaskCategories.INSPECTION].completedSinceInception +=
          Number(count);
      } else if (category === TaskCategories.SAFETY) {
        result[TaskCategories.SAFETY].completedSinceInception += Number(count);
      } else if (category === TaskCategories.TASK) {
        result[TaskCategories.TASK].completedSinceInception += Number(count);
      } else if (category === TaskCategories.DEFICIENCY) {
        result[TaskCategories.DEFICIENCY].completedSinceInception +=
          Number(count);
      }
    });

    return {
      data: result,
      message: 'Get closed work orders successfully',
    };
  }

  async getClosedWorkOrdersByAssignees(
    projectId: string,
    user: User,
  ): Promise<GetClosedWorkOrdersByAssigneesResponse> {
    const startOfWeek = new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay()),
    );
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    const completedThisWeekQ = await this.pmRepository
      .createQueryBuilder('pm')
      .select('pm.completedBy', 'completed_by')
      .addSelect('COUNT(*)', 'count')
      .leftJoinAndSelect('pm.completedBy', 'completedBy')
      .where('pm.completedAt >= :startOfWeek', { startOfWeek })
      .andWhere('pm.completedBy is not NULL')
      .andWhere('pm.status IN (:...status)', {
        status: [Statuses.COMPLETED, Statuses.SKIPPED],
      });

    const completedThisMonthQ = await this.pmRepository
      .createQueryBuilder('pm')
      .select('pm.completedBy', 'completed_by')
      .addSelect('COUNT(*)', 'count')
      .leftJoinAndSelect('pm.completedBy', 'completedBy')
      .where('pm.completedAt >= :startOfMonth', { startOfMonth })
      .andWhere('pm.completedBy is not NULL')
      .andWhere('pm.status IN (:...status)', {
        status: [Statuses.COMPLETED, Statuses.SKIPPED],
      });

    const completedSinceInceptionQ = await this.pmRepository
      .createQueryBuilder('pm')
      .select('pm.completedBy', 'completed_by')
      .addSelect('COUNT(*)', 'count')
      .leftJoinAndSelect('pm.completedBy', 'completedBy')
      .where('pm.status IN (:...status)', {
        status: [Statuses.COMPLETED, Statuses.SKIPPED],
      })
      .andWhere('pm.completedBy is not NULL');

    if (!projectId) {
      const subProjectIds = (
        await this.projectsService.findProjectsAndSubProjectByUserId(user.id)
      )
        .map(({ project }) =>
          project.subProjects.map((subProject) => subProject.id),
        )
        .flat(1);
      if (subProjectIds.length > 0) {
        completedThisWeekQ.andWhere('pm.subProject.id IN (:...subProjectIds)', {
          subProjectIds,
        });
        completedThisMonthQ.andWhere(
          'pm.subProject.id IN (:...subProjectIds)',
          {
            subProjectIds,
          },
        );
        completedSinceInceptionQ.andWhere(
          'pm.subProject.id IN (:...subProjectIds)',
          {
            subProjectIds,
          },
        );
      } else {
        return {
          message: 'Get all preventive maintenances successfully',
          data: [],
        };
      }
    }
    if (projectId) {
      completedThisWeekQ.andWhere('pm.project.id =:projectId', {
        projectId,
      });
      completedThisMonthQ.andWhere('pm.project.id =:projectId', {
        projectId,
      });
      completedSinceInceptionQ.andWhere('pm.project.id =:projectId', {
        projectId,
      });
    }

    completedThisWeekQ.groupBy('pm.completedBy').addGroupBy('completedBy.id');
    completedThisMonthQ.groupBy('pm.completedBy').addGroupBy('completedBy.id');
    completedSinceInceptionQ
      .groupBy('pm.completedBy')
      .addGroupBy('completedBy.id');

    const [completedThisWeek, completedThisMonth, completedSinceInception] =
      await Promise.all([
        completedThisWeekQ.getRawMany(),
        completedThisMonthQ.getRawMany(),
        completedSinceInceptionQ.getRawMany(),
      ]);

    const combinedResults = {};

    completedThisWeek.forEach((record) => {
      const user = {
        id: record.completed_by,
        image_url: record.completedBy_image_url,
        first_name: record.completedBy_first_name,
        last_name: record.completedBy_last_name,
        user_type: record.completedBy_user_type,
      };
      combinedResults[user.id] = combinedResults[user.id] || {
        completedBy: user,
        completedThisWeek: 0,
        completedThisMonth: 0,
        completedSinceInception: 0,
      };
      combinedResults[user.id].completedThisWeek = parseInt(record.count, 10);
    });

    completedThisMonth.forEach((record) => {
      const user = {
        id: record.completed_by,
        image_url: record.completedBy_image_url,
        first_name: record.completedBy_first_name,
        last_name: record.completedBy_last_name,
        user_type: record.completedBy_user_type,
      };
      combinedResults[user.id] = combinedResults[user.id] || {
        completedBy: user,
        completedThisWeek: 0,
        completedThisMonth: 0,
        completedSinceInception: 0,
      };
      combinedResults[user.id].completedThisMonth = parseInt(record.count, 10);
    });

    completedSinceInception.forEach((record) => {
      const user = {
        id: record.completed_by,
        image_url: record.completedBy_image_url,
        first_name: record.completedBy_first_name,
        last_name: record.completedBy_last_name,
        user_type: record.completedBy_user_type,
      };
      combinedResults[user.id] = combinedResults[user.id] || {
        completedBy: user,
        completedThisWeek: 0,
        completedThisMonth: 0,
        completedSinceInception: 0,
      };
      combinedResults[user.id].completedSinceInception = parseInt(
        record.count,
        10,
      );
    });

    const result = Object.values(combinedResults).sort(
      (a: any, b: any) => b.completedSinceInception - a.completedSinceInception,
    ) as ClosedWorkOrdersByAssignees[];

    return {
      data: result,
      message: 'Get closed work orders by assignees',
    };
  }

  private async getPmsCount(
    user: User,
    id: string,
    idBy: string,
    pmType: PMTypes,
    status: Statuses,
    assignees: string | string[],
    approvers: string | string[],
    teamMembers: string | string[],
    createdById: string,
    startDate: string,
    endDate: string,
    projectIds?: string[],
  ): Promise<number> {
    try {
      assignees = toArray(assignees);
      approvers = toArray(approvers);
      teamMembers = toArray(teamMembers);
      const pms = this.pmRepository
        .createQueryBuilder('pm')
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject');
      if (idBy === 'areaId') {
        pms
          .leftJoinAndSelect('pm.areas', 'areas')
          .leftJoinAndSelect('areas.area', 'area');
      }
      if (idBy === 'assetId') {
        pms
          .leftJoinAndSelect('pm.assets', 'assets')
          .leftJoinAndSelect('assets.asset', 'asset');
      }
      pms
        .leftJoinAndSelect('pm.assignees', 'assignees')
        .leftJoinAndSelect('assignees.user', 'user')
        .leftJoinAndSelect('pm.approvers', 'approvers')
        .leftJoinAndSelect('approvers.user', 'approverUser')
        .leftJoin('pm.teamMembers', 'teamMembers')
        .leftJoin('teamMembers.user', 'teamMemberUser')
        .leftJoin('pm.team', 'team')
        .leftJoin('team.projectTeamMembers', 'projectTeamMembers')
        .leftJoin('projectTeamMembers.user', 'projectTeamMembersUser')
        .where('pm.is_future =:isFuture', { isFuture: false });
      if (pmType) {
        pms.andWhere('pm.pmType = :pmType', { pmType });
      }
      if (status) {
        pms.andWhere('pm.status =:status', { status });
      }
      if (!projectIds) {
        if (idBy === 'projectId') {
          pms.andWhere('project.id = :id', { id });
        }
        if (idBy === 'subProjectId') {
          if (id != 'all') {
            pms.andWhere('subProject.id =:id', {
              id,
            });
          }
          if (id === 'all') {
            const subProjectIds = (
              await this.projectsService.findProjectsAndSubProjectByUserId(
                user.id,
              )
            )
              .map(({ project }) =>
                project.subProjects.map((subProject) => subProject.id),
              )
              .flat(1);
            if (subProjectIds.length > 0) {
              pms.andWhere('subProject.id IN (:...subProjectIds)', {
                subProjectIds,
              });
            } else {
              return 0;
            }
          }
        }
        // if (idBy === 'areaId') {
        //   pms.andWhere('area.id = :id', { id });
        // }
        // if (idBy === 'assetId') {
        //   pms.andWhere('asset.id = :id', { id });
        // }
        if (idBy === 'areaId') {
          pms.andWhere('areas.area.id = :id', { id });
        }
        if (idBy === 'assetId') {
          pms.andWhere('assets.asset.id = :id', { id });
        }
      }
      if (projectIds?.length) {
        const subProjectIds = await this.getSubProjectIds(user.id, projectIds);
        if (subProjectIds.length > 0) {
          pms.andWhere('subProject.id IN (:...subProjectIds)', {
            subProjectIds,
          });
        } else {
          return 0;
        }
      }
      if (teamMembers.length) {
        pms.andWhere(
          new Brackets((qb) => {
            qb.orWhere('projectTeamMembersUser.id IN (:...teamMembers)', {
              teamMembers,
            }).orWhere('teamMemberUser.id IN (:...teamMembers)', {
              teamMembers,
            });

            if (createdById) {
              qb.orWhere('pm.createdBy = :createdById', { createdById });
            }
          }),
        );
      } else {
        pms.andWhere(
          new Brackets((qb) => {
            if (assignees.length) {
              qb.orWhere('assignees.user.id IN (:...assignees)', { assignees });
            }
            if (approvers.length) {
              qb.orWhere('approvers.user.id IN (:...approvers)', { approvers });
            }
            if (createdById) {
              qb.orWhere('pm.createdBy = :createdById', { createdById });
            }
          }),
        );
      }

      if (startDate && endDate) {
        pms
          .andWhere('pm.dueDate >=:startDate', {
            startDate: `${startDate} 00:00:00`,
          })
          .andWhere('pm.dueDate <=:endDate', {
            endDate: `${endDate} 24:00:00`,
          });
      }

      return await pms.getCount();
    } catch (error) {
      throw error;
    }
  }

  async dashboardData(
    user: User,
    projectIds?: string[],
  ): Promise<GetDashboardResponseDto> {
    try {
      const subProjectIds = await this.getSubProjectIds(user.id, projectIds);

      if (subProjectIds.length === 0) {
        return {
          message: 'Get preventive maintenance successfully',
          data: {
            onTimeCounts: 0,
            sevenDaysDueCounts: 0,
            sevenToFourteenDaysDueCounts: 0,
            plusFourteenDaysDueCounts: 0,
            openItems: [],
          },
        };
      }

      // const pendingStatuses = [Statuses.PENDING, Statuses.WAITING_FOR_REVIEW];
      const pendingStatuses = [
        Statuses.PENDING,
        // Statuses.WAITING_FOR_REVIEW,
        // Statuses.DENIED,
      ];
      const formatDate = (daysOffset) =>
        `${moment()
          .subtract(daysOffset, 'days')
          .format('YYYY-MM-DD')} 00:00:00`;
      const teamMembers = {
        teamMembers: [user.id],
      };
      const createdById = { createdById: user.id };

      const counts = await Promise.all([
        this.pmRepository
          .createQueryBuilder('pm')
          .leftJoin('pm.teamMembers', 'teamMembers')
          .leftJoin('teamMembers.user', 'teamMemberUser')
          .leftJoin('pm.team', 'team')
          .leftJoin('team.projectTeamMembers', 'projectTeamMembers')
          .leftJoin('projectTeamMembers.user', 'projectTeamMembersUser')
          .where('pm.is_future = :isFuture', { isFuture: false })
          .andWhere('pm.subProject IN (:...subProjectIds)', { subProjectIds })
          .andWhere('pm.status IN(:...statuses)', { statuses: pendingStatuses })
          .andWhere('pm.dueDate >= :date', { date: formatDate(0) })
          .andWhere(
            new Brackets((qb) => {
              qb.orWhere(
                'projectTeamMembersUser.id IN (:...teamMembers)',
                teamMembers,
              )
                .orWhere('teamMemberUser.id IN (:...teamMembers)', teamMembers)
                .orWhere('pm.createdBy = :createdById', createdById);
            }),
          )
          .getCount(),

        this.pmRepository
          .createQueryBuilder('pm')
          .leftJoin('pm.teamMembers', 'teamMembers')
          .leftJoin('teamMembers.user', 'teamMemberUser')
          .leftJoin('pm.team', 'team')
          .leftJoin('team.projectTeamMembers', 'projectTeamMembers')
          .leftJoin('projectTeamMembers.user', 'projectTeamMembersUser')
          .where('pm.is_future = :isFuture', { isFuture: false })
          .andWhere('pm.subProject IN (:...subProjectIds)', { subProjectIds })
          .andWhere('pm.status IN(:...statuses)', { statuses: pendingStatuses })
          .andWhere('pm.dueDate BETWEEN :startDate AND :endDate', {
            startDate: formatDate(7),
            endDate: formatDate(1).replace('00:00:00', '24:00:00'),
          })
          .andWhere(
            new Brackets((qb) => {
              qb.orWhere(
                'projectTeamMembersUser.id IN (:...teamMembers)',
                teamMembers,
              )
                .orWhere('teamMemberUser.id IN (:...teamMembers)', teamMembers)
                .orWhere('pm.createdBy = :createdById', createdById);
            }),
          )
          .getCount(),

        this.pmRepository
          .createQueryBuilder('pm')
          .leftJoin('pm.teamMembers', 'teamMembers')
          .leftJoin('teamMembers.user', 'teamMemberUser')
          .leftJoin('pm.team', 'team')
          .leftJoin('team.projectTeamMembers', 'projectTeamMembers')
          .leftJoin('projectTeamMembers.user', 'projectTeamMembersUser')
          .where('pm.is_future = :isFuture', { isFuture: false })
          .andWhere('pm.subProject IN (:...subProjectIds)', { subProjectIds })
          .andWhere('pm.status IN(:...statuses)', { statuses: pendingStatuses })
          .andWhere('pm.dueDate BETWEEN :startDate AND :endDate', {
            startDate: formatDate(14),
            endDate: formatDate(8).replace('00:00:00', '24:00:00'),
          })
          .andWhere(
            new Brackets((qb) => {
              qb.orWhere(
                'projectTeamMembersUser.id IN (:...teamMembers)',
                teamMembers,
              )
                .orWhere('teamMemberUser.id IN (:...teamMembers)', teamMembers)
                .orWhere('pm.createdBy = :createdById', createdById);
            }),
          )
          .getCount(),

        this.pmRepository
          .createQueryBuilder('pm')
          .leftJoin('pm.teamMembers', 'teamMembers')
          .leftJoin('teamMembers.user', 'teamMemberUser')
          .leftJoin('pm.team', 'team')
          .leftJoin('team.projectTeamMembers', 'projectTeamMembers')
          .leftJoin('projectTeamMembers.user', 'projectTeamMembersUser')
          .where('pm.is_future = :isFuture', { isFuture: false })
          .andWhere('pm.subProject IN (:...subProjectIds)', { subProjectIds })
          .andWhere('pm.status IN(:...statuses)', { statuses: pendingStatuses })
          .andWhere('pm.dueDate <= :date', {
            date: formatDate(15).replace('00:00:00', '24:00:00'),
          })
          .andWhere(
            new Brackets((qb) => {
              qb.orWhere(
                'projectTeamMembersUser.id IN (:...teamMembers)',
                teamMembers,
              )
                .orWhere('teamMemberUser.id IN (:...teamMembers)', teamMembers)
                .orWhere('pm.createdBy = :createdById', createdById);
            }),
          )
          .getCount(),
      ]);

      const [
        onTimeCounts,
        sevenDaysDueCounts,
        sevenToFourteenDaysDueCounts,
        plusFourteenDaysDueCounts,
      ] = counts;

      const pmUserWise = await this.pmRepository
        .createQueryBuilder('pm')
        .leftJoinAndSelect('pm.assignees', 'assignees')
        .leftJoinAndSelect('assignees.user', 'user')
        .where('pm.is_future = :isFuture', { isFuture: false })
        .andWhere('pm.subProject IN (:...subProjectIds)', { subProjectIds })
        .andWhere('pm.status IN(:...statuses)', { statuses: pendingStatuses })
        .getMany();

      const openItems = pmUserWise.reduce((acc, pm) => {
        pm.assignees.forEach(({ user }) => {
          const index = acc.findIndex((item) => item.email === user.email);
          const dueType =
            moment().diff(pm.dueDate, 'days') > 0
              ? 'overDuePmCounts'
              : 'onTimePmCounts';

          if (index >= 0) {
            acc[index][dueType] += 1;
          } else {
            acc.push({
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              onTimePmCounts: dueType === 'onTimePmCounts' ? 1 : 0,
              overDuePmCounts: dueType === 'overDuePmCounts' ? 1 : 0,
            });
          }
        });
        return acc;
      }, []);

      openItems.sort(
        (a, b) =>
          b.overDuePmCounts +
          b.onTimePmCounts -
          (a.onTimePmCounts + a.overDuePmCounts),
      );

      return {
        message: 'Get preventive maintenance successfully',
        data: {
          onTimeCounts,
          sevenDaysDueCounts,
          sevenToFourteenDaysDueCounts,
          plusFourteenDaysDueCounts,
          openItems: openItems.slice(0, 10),
        },
      };
    } catch (error) {
      throw error;
    }
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

  private async getWorkId(pmType: PMTypes, subProjectId: string) {
    try {
      const findProject =
        await this.projectsService.findOneByIdSubProjectWithMasterProject(
          subProjectId,
        );
      // const clientCode = `02-${PMIds[pmType]}-`;
      const clientCode = `${findProject.project.workIdPrefix ?? '02'}-${
        findProject.workIdPrefix ?? findProject.name.length
      }-${PMIds[pmType]}-`;
      const defaultWid = clientCode + '1'.padStart(6, '0');
      const lastRecord = await this.pmRepository.findLastRecord(
        subProjectId,
        pmType,
      );
      if (lastRecord) {
        const workId = lastRecord?.workId;
        if (!workId) {
          return defaultWid;
        }
        const split = workId.split('-');
        const count = split[split.length - 1].replace(/\b0+/g, '');
        const newCount = Number(count) + 1;
        return clientCode + newCount.toString().padStart(6, '0');
      }
      return defaultWid;
    } catch (error) {
      throw error;
    }
  }

  async createOneYearPMsOld(
    createPMDto: Partial<PreventiveMaintenances>,
    masterPm: MasterPreventiveMaintenances,
    assigneeUsers: User[],
    approverUsers: User[],
    teamMemberUsers: User[],
    procedure?: CreateProcedureDto,
    assetIds?: string[],
    areaIds?: string[],
  ): Promise<void> {
    delete createPMDto.areas;
    delete createPMDto.assets;
    let loopLength = Math.ceil(12 / createPMDto.frequency - 1) || 1;
    if (createPMDto.frequencyType === FrequencyTypes.DAILY) {
      loopLength = 364;
    }
    if (createPMDto.frequencyType === FrequencyTypes.WEEKLY) {
      loopLength = moment(createPMDto.dueDate).weeksInYear();
    }

    for (let i = 0; i < loopLength; i++) {
      const dueDate = this.dueDateCalculate(masterPm);
      delete createPMDto.createdAt;

      let newProcedure = null;
      if (procedure) {
        const procedureCopy = { ...procedure };
        newProcedure = await this.proceduresService.createProcedure(
          procedureCopy,
        );
      }

      const workId = await this.getWorkId(
        createPMDto.pmType,
        createPMDto.subProject.id,
      );

      const pm = await this.pmRepository.save(
        new PreventiveMaintenances({
          ...createPMDto,
          masterPreventiveMaintenance: {
            ...masterPm,
            imageUrl: masterPm.imageUrl ? decodeURL(masterPm.imageUrl) : null,
          } as any,
          dueDate,
          isFuture: true,
          workId,
          imageUrl: createPMDto.imageUrl
            ? decodeURL(createPMDto.imageUrl)
            : null,
          procedure: newProcedure,
        }),
      );
      const promises = [];

      if (assetIds?.length) {
        promises.push(
          this.pmAssetsService.insertMany(
            assetIds.map((assetId) => ({
              asset: assetId,
              preventiveMaintenance: pm.id,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }

      if (areaIds?.length) {
        promises.push(
          this.pmAreasService.insertMany(
            areaIds.map((areaId) => ({
              area: areaId,
              preventiveMaintenance: pm.id,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }

      if (assigneeUsers.length) {
        promises.push(
          this.pmAssigneesService.insertMany(
            assigneeUsers.map((user) => ({
              user,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }

      if (approverUsers.length) {
        promises.push(
          this.pmApproversService.insertMany(
            approverUsers.map((user) => ({
              user,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }

      if (teamMemberUsers.length) {
        promises.push(
          this.pmTeamMembersService.insertMany(
            teamMemberUsers.map((user) => ({
              user,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }

      // Execute all promises concurrently
      await Promise.all(promises);

      masterPm.dueDate = dueDate;
    }
  }

  async createOneYearPMs(
    createPMDto: Partial<PreventiveMaintenances>,
    masterPm: MasterPreventiveMaintenances,
    assigneeUsers: string[],
    approverUsers: string[],
    teamMemberUsers: string[],
    procedure?: CreateProcedureDto,
    assetIds?: string[],
    areaIds?: string[],
    existingPm?,
  ): Promise<void> {
    delete createPMDto.areas;
    delete createPMDto.assets;
    if (existingPm) {
      const currentPMs = await this.pmRepository.findCurrentPMsByMasterPMId(
        masterPm.id,
      );
      const findPms = await this.pmRepository.findFutureAndCurrentPMs(
        masterPm.id,
        currentPMs.map((cp) => cp.id),
      );

      const ids = findPms.map((fpm) => fpm.id);
      const procedureIds = findPms
        .filter((fpm) => fpm.procedure)
        .map((fpm) => fpm.procedure.id);

      await Promise.all([
        this.notificationService.deleteNotificationByPmId(ids),
        this.proceduresService.deleteProcedureManyByPm(procedureIds),
        this.pmAssigneesService.deleteMany(ids),
        this.pmApproversService.deleteMany(ids),
        this.pmAreasService.deleteMany(ids),
        this.pmAssetsService.deleteMany(ids),
        this.pmTeamMembersService.deleteMany(ids),
      ]);
      await this.pmRepository.delete({
        id: In(ids),
      });
    }

    let loopLength = createPMDto?.frequency
      ? Math.ceil(12 / createPMDto.frequency - 1)
      : 1;
    if (createPMDto.frequencyType === FrequencyTypes.DAILY) {
      loopLength = 364;
    }
    if (createPMDto.frequencyType === FrequencyTypes.WEEKLY) {
      loopLength = moment(createPMDto.dueDate).weeksInYear();
    }

    for (let i = 0; i < loopLength; i++) {
      const dueDate = this.dueDateCalculate(masterPm);
      delete createPMDto.createdAt;

      let newProcedure = null;
      if (procedure) {
        const procedureCopy = { ...procedure };
        newProcedure = await this.proceduresService.createProcedure(
          procedureCopy,
        );
      }

      const workId = await this.getWorkId(
        createPMDto.pmType,
        createPMDto.subProject.id,
      );

      const pm = await this.pmRepository.save(
        new PreventiveMaintenances({
          ...createPMDto,
          masterPreventiveMaintenance: {
            ...masterPm,
            imageUrl: masterPm.imageUrl ? decodeURL(masterPm.imageUrl) : null,
          } as any,
          dueDate,
          isFuture: true,
          workId,
          imageUrl: createPMDto.imageUrl
            ? decodeURL(createPMDto.imageUrl)
            : null,
          procedure: newProcedure,
        }),
      );
      const promises = [];

      if (assetIds?.length) {
        promises.push(
          this.pmAssetsService.insertMany(
            assetIds.map((assetId) => ({
              asset: assetId,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }

      if (areaIds?.length) {
        promises.push(
          this.pmAreasService.insertMany(
            areaIds.map((areaId) => ({
              area: areaId,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }

      if (assigneeUsers?.length) {
        promises.push(
          this.pmAssigneesService.insertMany(
            assigneeUsers.map((user) => ({
              user,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }

      if (approverUsers?.length) {
        promises.push(
          this.pmApproversService.insertMany(
            approverUsers.map((user) => ({
              user,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }

      if (teamMemberUsers?.length) {
        promises.push(
          this.pmTeamMembersService.insertMany(
            teamMemberUsers.map((user) => ({
              user,
              preventiveMaintenance: pm,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            })),
          ),
        );
      }

      // Execute all promises concurrently
      await Promise.all(promises);

      masterPm.dueDate = dueDate;
    }
  }

  async createForCSV(
    user: User,
    token: string,
    pmType: PMTypes,
    createPMDto: CreatePreventiveMaintenanceDto,
  ): Promise<CreatePreventiveMaintenanceResponseDto> {
    try {
      const notifyBefore =
        pmType === PMTypes.PM_EXTERNAL
          ? NotifyBefore.PM_EXTERNAL
          : NotifyBefore.PM_INTERNAL;

      const project = await this.projectsService.findOneById(
        createPMDto.projectId,
      );

      const subProject = await this.projectsService.findOneByIdSubProject(
        createPMDto.subProjectId,
      );

      const preferredSupplier = createPMDto.preferredSupplierId
        ? await this.getSupplier(createPMDto.preferredSupplierId)
        : null;

      // let area;
      // let asset;
      let procedureLibrary;
      let procedureLibrarySteps;
      let procedure;
      let team;
      const procedureSteps = [];
      // if (createPMDto.areaId) {
      //   area = await this.areasService.findOneById(createPMDto.areaId);
      // }
      // if (createPMDto.assetId) {
      //   asset = await this.assetsService.findOneById(createPMDto.assetId);
      // }
      if (createPMDto.procedureLibraryId) {
        if (createPMDto.procedureLibraryId) {
          procedureLibrary = await this.proceduresService.findOneById(
            createPMDto.procedureLibraryId,
          );
          procedureLibrarySteps = procedureLibrary.procedureSteps;
          delete procedureLibrary.procedureSteps;
        }

        procedureLibrarySteps.forEach((step) => {
          procedureSteps.push({
            name: step.name,
            description: step.description,
            defaultImageUrl: step.imageUrl ? decodeURL(step.imageUrl) : null,
            order: step.order,
            durationMins: null,
            comments: null,
          });
        });

        procedure = await this.proceduresService.createProcedure({
          name: procedureLibrary.name,
          projectId: procedureLibrary?.project?.id,
          comments: procedureLibrary.comments,
          fileUpload: procedureLibrary.fileUpload,
          description: procedureLibrary.description,
          procedureSteps: procedureSteps,
          jobType: procedureLibrary.jobType,
          procedureLibrary: procedureLibrary,
          reference: procedureLibrary.reference
            ? procedureLibrary.reference
            : null,
          imageUrl: procedureLibrary.imageUrl
            ? decodeURL(procedureLibrary.imageUrl)
            : null,
        });
      }
      if (createPMDto.teamId) {
        team = await this.projectsService.findOneProjectTeamById(
          createPMDto.teamId,
        );
      }

      const pmCreate: Partial<PreventiveMaintenances> = {
        project: project,
        subProject: subProject,
        area: null,
        asset: null,
        procedure: procedure,
        workTitle: createPMDto.workTitle,
        preferredSupplier: preferredSupplier,
        contractEndDate: dateToUTC(createPMDto.contractEndDate),
        date: createPMDto.date ? Number(createPMDto.date) : null,
        day: createPMDto.day,
        week: createPMDto.week,
        dayType: createPMDto.dayType,
        detail: createPMDto.detail,
        dueDate: dateToUTC(createPMDto.dueDate),
        frequency: createPMDto.frequency ? Number(createPMDto.frequency) : null,
        isRecurring: createPMDto.isRecurring == 'true' ? true : false,
        pmType: pmType,
        notifyBefore,
        createdBy: user,
        taskCategory: createPMDto.taskCategory,
        isGeneric:
          !createPMDto?.areaIds?.length && !createPMDto?.assetIds?.length
            ? true
            : false,
        frequencyType: createPMDto?.frequencyType ?? null,
        priority: createPMDto.priority,
        team: team,
      };
      const mpmCreate = { ...pmCreate };
      delete mpmCreate.procedure;
      const masterPm = await this.masterPmRepository.save(
        new MasterPreventiveMaintenances({
          ...(mpmCreate as any),
          procedureLibrary: procedureLibrary,
        }),
      );
      if (createPMDto?.assetIds?.length) {
        await this.pmAssetsService.insertManyMaster([
          ...createPMDto.assetIds.map((asset) => ({
            asset,
            masterPreventiveMaintenance: masterPm,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }
      if (createPMDto?.areaIds?.length) {
        await this.pmAreasService.insertManyMaster([
          ...createPMDto.areaIds.map((area) => ({
            area,
            masterPreventiveMaintenance: masterPm,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }
      if (createPMDto.assignees?.length) {
        // const assigneeUsers = await this.usersService.findUsersByIds(
        //   createPMDto.assignees,
        // );
        //   await this.pmAssigneesService.insertManyMaster([
        //     ...assigneeUsers.map((user) => ({
        //       user,
        //       masterPreventiveMaintenance: masterPm,
        //       createdAt: dateToUTC(),
        //       updatedAt: dateToUTC(),
        //     })),
        //   ]);
        await this.pmAssigneesService.insertManyMaster([
          ...createPMDto.assignees.map((user) => ({
            user,
            masterPreventiveMaintenance: masterPm.id,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }

      // let approverUsers = [];
      if (createPMDto.approvers?.length) {
        // approverUsers = await this.usersService.findUsersByIds(
        //   createPMDto.approvers,
        // );
        // await this.pmApproversService.insertManyMaster([
        //   ...approverUsers.map((user) => ({
        //     user,
        //     masterPreventiveMaintenance: masterPm,
        //     createdAt: dateToUTC(),
        //     updatedAt: dateToUTC(),
        //   })),
        // ]);
        await this.pmApproversService.insertManyMaster([
          ...createPMDto.approvers.map((user) => ({
            user,
            masterPreventiveMaintenance: masterPm.id,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }

      // let teamMemberUsers = [];
      if (createPMDto.teamMembers?.length) {
        // teamMemberUsers = await this.usersService.findUsersByIds(
        //   createPMDto.teamMembers,
        // );
        // await this.pmTeamMembersService.insertManyMaster([
        //   ...teamMemberUsers.map((user) => ({
        //     user,
        //     masterPreventiveMaintenance: masterPm,
        //     createdAt: dateToUTC(),
        //     updatedAt: dateToUTC(),
        //   })),
        // ]);

        await this.pmTeamMembersService.insertManyMaster([
          ...createPMDto.teamMembers.map((user) => ({
            user,
            masterPreventiveMaintenance: masterPm.id,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }
      pmCreate.workId = await this.getWorkId(pmType, subProject.id);
      const pm = await this.pmRepository.save(
        new PreventiveMaintenances({
          masterPreventiveMaintenance: masterPm,
          ...pmCreate,
        }),
      );
      user = await this.usersService.findOneById(user.id);
      if (createPMDto?.assetIds?.length) {
        await this.pmAssetsService.insertMany([
          ...createPMDto.assetIds.map((asset) => ({
            asset,
            preventiveMaintenance: pm,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }
      if (createPMDto?.areaIds?.length) {
        await this.pmAreasService.insertMany([
          ...createPMDto.areaIds.map((area) => ({
            area,
            preventiveMaintenance: pm,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }
      if (createPMDto.assignees?.length) {
        // const assignees = assigneeUsers.map((user) => ({
        //   user,
        //   preventiveMaintenance: pm,
        //   createdAt: dateToUTC(),
        //   updatedAt: dateToUTC(),
        // }));
        // await this.pmAssigneesService.insertMany(assignees);
        await this.pmAssigneesService.insertMany([
          ...createPMDto.assignees.map((user) => ({
            user,
            preventiveMaintenance: pm.id,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }
      if (createPMDto.approvers?.length) {
        // const approvers = approverUsers.map((user) => ({
        //   user,
        //   preventiveMaintenance: pm,
        //   createdAt: dateToUTC(),
        //   updatedAt: dateToUTC(),
        // }));
        // await this.pmApproversService.insertMany(approvers);
        await this.pmApproversService.insertMany([
          ...createPMDto.approvers.map((user) => ({
            user,
            masterPreventiveMaintenance: pm.id,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }

      if (createPMDto.teamMembers?.length) {
        // const teamMembers = teamMemberUsers.map((user) => ({
        //   user,
        //   preventiveMaintenance: pm,
        //   createdAt: dateToUTC(),
        //   updatedAt: dateToUTC(),
        // }));
        // await this.pmTeamMembersService.insertMany(teamMembers);
        await this.pmTeamMembersService.insertMany([
          ...createPMDto.teamMembers.map((user) => ({
            user,
            preventiveMaintenance: pm.id,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }

      let procedureObject;
      if (createPMDto.procedureLibraryId) {
        procedureObject = {
          name: procedureLibrary.name,
          comments: procedureLibrary.comments,
          fileUpload: procedureLibrary.fileUpload,
          description: procedureLibrary.description,
          procedureSteps: procedureSteps,
          jobType: procedureLibrary.jobType,
          procedureLibrary: procedureLibrary,
          reference: procedureLibrary.reference
            ? procedureLibrary.reference
            : null,
          imageUrl: procedureLibrary.imageUrl
            ? decodeURL(procedureLibrary.imageUrl)
            : null,
        };
      }

      if (createPMDto.isRecurring == 'true') {
        await this.createOneYearPMs(
          pmCreate,
          masterPm,
          createPMDto.assignees,
          createPMDto.approvers,
          createPMDto.teamMembers,
          createPMDto.procedureLibraryId ? procedureObject : null,
          createPMDto.assetIds,
          createPMDto.areaIds,
          null,
        );
      }
      return {
        message: 'Preventive maintenance created successfully',
        data: pm,
      };
    } catch (error) {
      throw error;
    }
  }

  async createManyWithCSV(
    user: User,
    token: string,
    file: Express.Multer.File,
  ): Promise<BaseResponseDto> {
    try {
      const pmsCSV = CSVToJSON<any>(file.buffer.toString());

      const validPMs = pmsCSV.filter(
        (element) =>
          element.projectid &&
          element.subprojectid &&
          element.worktitle &&
          element.teamid &&
          element.teamid !== '' &&
          element.duedate &&
          element.isrecurring,
      );

      // Sequentially process each element
      for (const element of validPMs) {
        const getTeam = await this.projectsService.findOneByIdTeam(
          element.teamid,
        );
        const users = getTeam
          ? getTeam.projectTeamMembers.map(({ user }) => user.id)
          : [];

        const pm: any = {
          taskCategory: element.taskcategory,
          workTitle: element.worktitle,
          detail: element.detail || null,
          priority: element.priority,
          dueDate: element.duedate,
          isRecurring: element.isrecurring === '1' ? 'true' : 'false',
          frequency: element.frequency,
          frequencyType: element.frequencytype,
          dayType: element.daytype || null,
          date: element.date || null,
          day: element.day || null,
          week: element.week || null,
          projectId: element.projectid,
          teamId: element.teamid || null,
          subProjectId: element.subprojectid,
          procedureLibraryId: element.procedurelibraryid || null,
          areaId: element.areaid || null,
          assetId: element.assetid || null,
          assignees: users,
          approvers: users,
        };

        // Execute create function for each PM sequentially
        await this.createForCSV(user, token, element.pmtype, pm);
      }

      return {
        message: 'Preventive Maintenance created successfully',
      };
    } catch (error) {
      throw new Error(
        `Failed to create Preventive Maintenance: ${error.message}`,
      );
    }
  }
  dueDateCalculate(masterPms: Partial<MasterPreventiveMaintenances>) {
    console.log('dueDatedueDatedueDate,', masterPms.dueDate);

    let dueDate =
      masterPms.frequencyType === FrequencyTypes.MONTHLY
        ? moment(masterPms.dueDate)
            .add(masterPms.frequency, 'months')
            .endOf('month')
        : masterPms.frequencyType === FrequencyTypes.WEEKLY
        ? moment(masterPms.dueDate)
            .isoWeekday(DayValues[masterPms.day]) // Find Sunday
            .add(
              moment(masterPms.dueDate).isoWeekday() >= DayValues[masterPms.day]
                ? 7
                : 0,
              'days',
            )
        : masterPms.frequencyType === FrequencyTypes.DAILY
        ? moment(masterPms.dueDate).add(1, 'days')
        : null;
    dueDate = dueDate.utc();
    console.log('dueDatedueDate222', dueDate);
    if (masterPms.frequencyType === FrequencyTypes.MONTHLY) {
      if (masterPms.dayType === DayTypes.Date) {
        dueDate = dueDate.set('date', masterPms.date);
      }
      if (masterPms.dayType === DayTypes.Day) {
        const week = WeekValues[masterPms.week];
        const startWeek = moment(dueDate).startOf('month').week();
        const lastWeek =
          dueDate.format('M') === '12'
            ? moment().weeksInYear()
            : moment(dueDate).endOf('month').week();
        const weeks = masterPms.week === Weeks.Last ? lastWeek : startWeek;
        let date = moment(dueDate)
          .set('weeks', weeks + week)
          .weekday(DayValues[masterPms.day]);
        if (date.format('M') != dueDate.format('M')) {
          if (masterPms.week === Weeks.First) {
            date = moment(dueDate)
              .set('weeks', startWeek + week + 1)
              .weekday(DayValues[masterPms.day]);
          }
          if (masterPms.week === Weeks.Last) {
            date = moment(dueDate)
              .set('weeks', lastWeek - 1)
              .weekday(DayValues[masterPms.day]);
          }
        }
        dueDate = date;
      }
    }
    console.log('dueDatedueDatedueDate,', dueDate);
    return dueDate.toDate();
  }

  async getTeamMembers(pm: PreventiveMaintenances, includeAssignees?: boolean) {
    let users = (
      pm.teamMembers.length ? pm.teamMembers : pm.team?.projectTeamMembers
    )?.map((tm) => tm.user);
    if (pm.pmType === PMTypes.PM_INTERNAL && !includeAssignees) {
      users = users.filter((user) => user.user_type !== UserTypes.EXTERNAL);
    }
    return users;
  }

  async getTeamMembersWithExternalAssignees(pm: PreventiveMaintenances) {
    const assigneeIds = pm.assignees.map(({ user }) => user.id);
    let teamMembers = await this.getTeamMembers(pm, true);
    teamMembers = teamMembers?.filter((member: User) => {
      if (member.user_type !== UserTypes.EXTERNAL) {
        return member;
      } else if (
        member.user_type === UserTypes.EXTERNAL &&
        assigneeIds.includes(member.id)
      ) {
        return member;
      }
      return false;
    });

    return teamMembers;
  }

  async getTeamMembersWithoutAssignees(pm) {
    let teamMembers = await this.getTeamMembers(pm);
    teamMembers = teamMembers?.filter((user) => {
      const findOne = pm.assignees.find(
        (assignee) => assignee.user.id === user.id,
      );
      return !findOne;
    });
    return teamMembers;
  }

  async teamMembersFromDjangoAndSendEmailQueue(pmId: string, requestType) {
    return await this.preventiveMaintenancesQueue.add(
      'teamMembersFromDjangoAndSendEmail',
      {
        pmId,
        requestType,
      },
    );
  }

  async teamMembersFromDjangoAndSendEmail(pmId: string, requestType) {
    try {
      const pm = await this.pmRepository.findOneWithAssignees(pmId);
      if (pm.priority === Priorities.CRITICAL) {
        const users = {
          teamMembers: await this.getTeamMembersWithoutAssignees(pm),
          assignees: pm.assignees,
        };
        for (let i = 0; i < users.teamMembers.length; i++) {
          const { subject, body } = this.getTemplateBasedOnStatus(
            pm,
            users.teamMembers[i],
            requestType,
            'information',
          );
          const template = DefaultEmailTemplate.get(body);
          await this.sendGridService.sendMail({
            text: template,
            subject: subject,
            to: users.teamMembers[i].email,
          });
        }
        for (let i = 0; i < users.assignees.length; i++) {
          const { subject, body } = this.getTemplateBasedOnStatus(
            pm,
            users.assignees[i].user,
            requestType,
            'actionRequired',
          );
          const template = DefaultEmailTemplate.get(body);
          await this.sendGridService.sendMail({
            text: template,
            subject: subject,
            to: users.assignees[i].user.email,
          });
        }
      }
    } catch (error) {
      console.log('teamMembersFromDjangoAndSendEmail ===>', error);
    }
  }

  getTemplateBasedOnStatus(data, user, requestType, emailType) {
    const emailData = {
      ...data,
      url: `${this.frontendConfigFactory.frontendUrl}/my-work-orders/pm/${data.project.id}/${data.subProject.id}/${data.id}?pmType=${data.pmType}&redirected=email`,
      actionTaken: null,
      actionRequired: null,
    };
    const pmType =
      data.pmType === PMTypes.PM_EXTERNAL
        ? 'PM External'
        : data.pmType === PMTypes.TASK
        ? 'Task'
        : 'PM Internal';
    let subject = '';
    let body = `<p style='margin: 0;'> Hello ${user.first_name} ${user.last_name}</p> <br/> <p style='margin: 0;'>The following critical Work Order has been updated.
    </p>`;
    switch (requestType) {
      case 'CREATED':
        if (emailType === 'information') {
          subject = `Information (${pmType}), Site: ${data.project.name}, Asset Category: ${data.subProject.name}`;
          emailData.actionTaken = `New ${pmType} Created.`;
        } else {
          subject = `Critical: Action Required (${pmType}), Site: ${data.project.name}, Asset Category: ${data.subProject.name}`;
          emailData.actionRequired = `Assignee needs to take action.`;
        }
        break;
      case Statuses.WAITING_FOR_REVIEW:
        if (emailType === 'actionRequired') {
          subject = `Information (${pmType}), Site: ${data.project.name}, Asset Category: ${data.subProject.name}`;
          emailData.actionTaken = `${pmType} work is submitted for review.`;
        } else {
          subject = `Critical: Action Required (${pmType}), Site: ${data.project.name}, Asset Category: ${data.subProject.name}`;
          emailData.actionRequired = `Review the ${pmType} work.`;
        }
        break;
      case Statuses.SKIPPED:
        subject = `Information (${pmType}), Site: ${data.project.name}, Asset Category: ${data.subProject.name}`;
        emailData.actionTaken = `Status of ${pmType} Entry changes to Skip.`;
        break;
      case Statuses.COMPLETED:
        subject = `Information (${pmType}), Site: ${data.project.name}, Asset Category: ${data.subProject.name}`;
        emailData.actionTaken = `Status of PM ${pmType} Entry changes to Complete.`;
        break;
      case 'UPLOAD':
        subject = `Information (${pmType}), Site: ${data.project.name}, Asset Category: ${data.subProject.name}`;
        emailData.actionTaken = `${pmType} Documents Uploaded.`;
        break;
    }
    body += `${DefaultEmailTemplate.getPMTable(emailData)}`;
    return { body, subject };
  }
}
