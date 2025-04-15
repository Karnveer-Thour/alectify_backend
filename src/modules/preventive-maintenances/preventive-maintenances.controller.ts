import { BaseResponseDto } from '@common/dto/base-response.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePreventiveMaintenanceResponseDto } from './dto/create-preventive-maintenance-response.dto';
import {
  CreatePreventiveMaintenanceDto,
  CreatePreventiveMaintenanceDocumentsDto,
} from './dto/create-preventive-maintenance.dto';
import {
  GetAllByDueDatePMParamsDto,
  GetAllByDueDateWithProjectPMParamsDto,
} from './dto/get-all-by-due-date-preventive-maintenance.dto';
import { GetAllCountPreventiveMaintenanceResponseDto } from './dto/get-all-count-preventive-maintenance-response.dto';
import { GetAllPreventiveMaintenanceResponseDto } from './dto/get-all-preventive-maintenance-response.dto';
import {
  GetAllCountPreventiveMaintenanceParamsDto,
  GetAllPreventiveMaintenanceParamsDto,
  GetAllPreventiveMaintenanceQueryDto,
} from './dto/get-all-preventive-maintenance.dto';
import { GetCountsByStatusPreventiveMaintenanceResponseDto } from './dto/get-counts-by-status-preventive-maintenance-response.dto';
import {
  GetCountsByStatusPreventiveMaintenanceParamsDto,
  GetCountsByStatusPreventiveMaintenanceQueryDto,
} from './dto/get-counts-by-status-preventive-maintenance.dto';
import { GetDashboardResponseDto } from './dto/get-dashboard-preventive-maintenance-response.dto';
import {
  GetClosedWorkOrdersByAssigneesResponse,
  GetClosedWorkOrdersResponseDto,
  GetPmCountsResponseDto,
} from './dto/get-pm-counts.dto';
import { PMTypeParamsDto } from './dto/pm-type-preventive-maintenance.dto';
import { UpdatePreventiveMaintenanceDto } from './dto/update-preventive-maintenance.dto';
import {
  UpdateStatusPreventiveMaintenanceDto,
  UpdateStatusPreventiveMaintenanceParamsDto,
} from './dto/update-status-preventive-maintenance.dto';
import { UpdateStepStatusPreventiveMaintenanceResponseDto } from './dto/update-step-status-preventive-maintenance-response.dto';
import {
  UpdateAllStepStatusPreventiveMaintenanceDto,
  UpdateStepStatusPreventiveMaintenanceDto,
  UpdateStepStatusPreventiveMaintenanceParamsDto,
} from './dto/update-step-status-preventive-maintenance.dto';
import { PreventiveMaintenancesService } from './preventive-maintenances.service';
import { CreatePreventiveMaintenanceManyCSVDto } from './dto/create-many-preventive-maintenance-csv.dto';
import {
  disAllowedExtensions,
  getFileNameFromFolders,
} from '@common/utils/utils';

@ApiBearerAuth()
@ApiTags('Preventive Maintenances')
@Controller('preventive-maintenances')
export class PreventiveMaintenancesController {
  constructor(
    private readonly preventiveMaintenancesService: PreventiveMaintenancesService,
  ) {}

  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @Post('create-many-csv')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file to upload containing spare parts data',
    type: CreatePreventiveMaintenanceManyCSVDto,
  })
  createManyWithCSV(
    @Req() req,
    @Body()
    createPreventiveMaintenanceManyCSVDto: CreatePreventiveMaintenanceManyCSVDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponseDto> {
    return this.preventiveMaintenancesService.createManyWithCSV(
      req.user,
      req.headers.authorization,
      file,
    );
  }

  @ApiCreatedResponse({
    type: CreatePreventiveMaintenanceResponseDto,
  })
  @Post(':pmType')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images' }, { name: 'files' }]),
  )
  create(
    @Req() req,
    @Param() { pmType }: PMTypeParamsDto,
    @Body() createPreventiveMaintenanceDto: CreatePreventiveMaintenanceDto,
    @UploadedFiles() documents: CreatePreventiveMaintenanceDocumentsDto,
  ): Promise<CreatePreventiveMaintenanceResponseDto> {
    if (documents) {
      const fileNames = getFileNameFromFolders(documents, ['images', 'files']);
      const checkFiles = disAllowedExtensions(fileNames);
      if (checkFiles.length) {
        throw new BadRequestException(
          `File type ${checkFiles[0]} is not allowed.`,
        );
      }
    }
    return this.preventiveMaintenancesService.create(
      req.user,
      req.headers.authorization,
      pmType,
      createPreventiveMaintenanceDto,
      documents,
    );
  }

  @ApiOkResponse({
    type: GetClosedWorkOrdersByAssigneesResponse,
  })
  @Get('closed-work-orders-by-assignees')
  async getClosedWorkOrdersByAssignees(
    @Req() req,
    @Query('projectId') projectId: string,
  ): Promise<GetClosedWorkOrdersByAssigneesResponse> {
    return this.preventiveMaintenancesService.getClosedWorkOrdersByAssignees(
      projectId,
      req.user,
    );
  }

  @ApiOkResponse({
    type: GetClosedWorkOrdersResponseDto,
  })
  @Get('closed-work-orders')
  async getClosedWorkOrders(
    @Req() req,
    @Query('projectId') projectId: string,
  ): Promise<GetClosedWorkOrdersResponseDto> {
    return this.preventiveMaintenancesService.getClosedWorkOrders(
      projectId,
      req.user,
    );
  }

  @Get('dashboard')
  dashboardData(
    @Req() req,
    @Query('projectIds') projectIds: string[],
  ): Promise<GetDashboardResponseDto> {
    return this.preventiveMaintenancesService.dashboardData(
      req.user,
      projectIds,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.preventiveMaintenancesService.findOne(id);
  }

  @Get('master/:id')
  findOneMaster(@Param('id', ParseUUIDPipe) id: string) {
    return this.preventiveMaintenancesService.findOneMaster(id);
  }

  @ApiOkResponse({
    type: CreatePreventiveMaintenanceResponseDto,
  })
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images' }, { name: 'files' }]),
  )
  update(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePreventiveMaintenanceDto: UpdatePreventiveMaintenanceDto,
    @UploadedFiles() documents: CreatePreventiveMaintenanceDocumentsDto,
  ): Promise<CreatePreventiveMaintenanceResponseDto> {
    if (documents) {
      const fileNames = getFileNameFromFolders(documents, ['images', 'files']);
      const checkFiles = disAllowedExtensions(fileNames);
      if (checkFiles.length) {
        throw new BadRequestException(
          `File type ${checkFiles[0]} is not allowed.`,
        );
      }
    }

    return this.preventiveMaintenancesService.update(
      req.user,
      id,
      updatePreventiveMaintenanceDto,
      req.headers.authorization,
      documents,
    );
  }

  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @Delete(':id')
  delete(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto> {
    return this.preventiveMaintenancesService.delete(
      id,
      req.user,
      req.headers.authorization,
    );
  }

  @ApiOkResponse({
    type: UpdateStepStatusPreventiveMaintenanceResponseDto,
  })
  @Patch('step-status/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateStepStatus(
    @Req() req,
    @Param() { id }: UpdateStepStatusPreventiveMaintenanceParamsDto,
    @Body()
    updateStepStatusPreventiveMaintenanceDto: UpdateStepStatusPreventiveMaintenanceDto,
    @UploadedFile() uploadedImage: Express.Multer.File,
  ): Promise<UpdateStepStatusPreventiveMaintenanceResponseDto> {
    if (uploadedImage) {
      const checkFiles = disAllowedExtensions([uploadedImage.originalname]);
      if (checkFiles.length) {
        throw new BadRequestException(
          `File type ${checkFiles[0]} is not allowed.`,
        );
      }
    }
    return this.preventiveMaintenancesService.updateStepStatus(
      req.user,
      id,
      req.headers.authorization,
      updateStepStatusPreventiveMaintenanceDto,
      uploadedImage,
    );
  }

  @Patch('all-step-status/:id')
  updateAllStepStatus(
    @Req() req,
    @Param() { id }: UpdateStepStatusPreventiveMaintenanceParamsDto,
    @Body()
    updateAllStepStatusPreventiveMaintenanceDto: UpdateAllStepStatusPreventiveMaintenanceDto,
  ): Promise<UpdateStepStatusPreventiveMaintenanceResponseDto> {
    return this.preventiveMaintenancesService.updateAllStepsStatus(
      req.user,
      id,
      req.headers.authorization,
      updateAllStepStatusPreventiveMaintenanceDto,
    );
  }

  @ApiOkResponse({
    type: UpdateStepStatusPreventiveMaintenanceResponseDto,
  })
  @Patch('reopen/:id')
  reopenPM(
    @Req() req,
    @Param() { id }: UpdateStepStatusPreventiveMaintenanceParamsDto,
  ): Promise<CreatePreventiveMaintenanceResponseDto> {
    return this.preventiveMaintenancesService.reopenPM(
      req.user,
      req.headers.authorization,
      id,
    );
  }

  @ApiOkResponse({
    type: CreatePreventiveMaintenanceResponseDto,
  })
  @Patch(':id/:status')
  updateStatus(
    @Req() req,
    @Param() { id, status }: UpdateStatusPreventiveMaintenanceParamsDto,
    @Body()
    updateStatusPreventiveMaintenanceDto: UpdateStatusPreventiveMaintenanceDto,
  ): Promise<CreatePreventiveMaintenanceResponseDto> {
    return this.preventiveMaintenancesService.updateStatus(
      req.user,
      req.headers.authorization,
      id,
      status,
      updateStatusPreventiveMaintenanceDto,
    );
  }

  @ApiOkResponse({
    type: GetCountsByStatusPreventiveMaintenanceResponseDto,
  })
  @Get('by-sub-project-id/:id/:status/counts')
  getByProjectIdAndStatus(
    @Req() req,
    @Param()
    { id, status }: GetCountsByStatusPreventiveMaintenanceParamsDto,
    @Query()
    {
      assignees = null,
      approvers = null,
      teamMembers = null,
      createdById = null,
    }: GetCountsByStatusPreventiveMaintenanceQueryDto,
  ): Promise<GetCountsByStatusPreventiveMaintenanceResponseDto> {
    return this.preventiveMaintenancesService.getByProjectIdAndStatus(
      req.user,
      id,
      status,
      assignees,
      approvers,
      teamMembers,
      createdById,
    );
  }

  @ApiOkResponse({
    type: GetCountsByStatusPreventiveMaintenanceResponseDto,
  })
  @Get('by-asset-id/:id/:status/counts')
  getByAssetIdAndStatus(
    @Req() req,
    @Param()
    { id, status }: GetCountsByStatusPreventiveMaintenanceParamsDto,
    @Query()
    {
      assignees = null,
      approvers = null,
      teamMembers = null,
      createdById = null,
    }: GetCountsByStatusPreventiveMaintenanceQueryDto,
  ): Promise<GetCountsByStatusPreventiveMaintenanceResponseDto> {
    return this.preventiveMaintenancesService.getByAssetIdAndStatus(
      req.user,
      id,
      status,
      assignees,
      approvers,
      teamMembers,
      createdById,
    );
  }

  @Get('by-area-id/:id/:status/counts')
  getByAreaIdAndStatus(
    @Req() req,
    @Param()
    { id, status }: GetCountsByStatusPreventiveMaintenanceParamsDto,
    @Query()
    {
      assignees = null,
      approvers = null,
      teamMembers = null,
      createdById = null,
    }: GetCountsByStatusPreventiveMaintenanceQueryDto,
  ): Promise<GetCountsByStatusPreventiveMaintenanceResponseDto> {
    return this.preventiveMaintenancesService.getByAreaIdAndStatus(
      req.user,
      id,
      status,
      assignees,
      approvers,
      teamMembers,
      createdById,
    );
  }

  @ApiOkResponse({
    type: GetAllPreventiveMaintenanceResponseDto,
  })
  @Get('by-due-date/:startDate/:endDate')
  findAllByDueDate(
    @Req() req,
    @Param()
    { startDate, endDate }: GetAllByDueDatePMParamsDto,
  ): Promise<GetAllPreventiveMaintenanceResponseDto> {
    return this.preventiveMaintenancesService.findAllByDueDate(
      req.user,
      startDate,
      endDate,
    );
  }

  @ApiOkResponse({
    type: GetAllPreventiveMaintenanceResponseDto,
  })
  @Get(':projectId/:subProjectId/counts')
  getAllCountsByProjectAndSubProject(
    @Req() req,
    @Param()
    { projectId, subProjectId }: GetAllCountPreventiveMaintenanceParamsDto,
    @Query()
    {
      assignees = null,
      approvers = null,
      teamMembers = null,
      createdById = null,
      startDate = null,
      endDate = null,
      projectIds = null,
    }: GetCountsByStatusPreventiveMaintenanceQueryDto,
  ): Promise<GetAllCountPreventiveMaintenanceResponseDto> {
    return this.preventiveMaintenancesService.getAllCountsByProjectAndSubProject(
      req.user,
      projectId,
      subProjectId,
      assignees,
      approvers,
      teamMembers,
      createdById,
      startDate,
      endDate,
      projectIds,
    );
  }

  @ApiOkResponse({
    type: GetPmCountsResponseDto,
  })
  @Get('/v2/:projectId/:subProjectId/counts')
  getPmCounts(
    @Req() req,
    @Param()
    { projectId, subProjectId }: GetAllCountPreventiveMaintenanceParamsDto,
  ): Promise<GetPmCountsResponseDto> {
    return this.preventiveMaintenancesService.getCount(
      req.user,
      projectId,
      subProjectId,
    );
  }

  @ApiOkResponse({
    type: GetAllPreventiveMaintenanceResponseDto,
  })
  @Get(':projectId/:subProjectId/:pmType')
  findAll(
    @Req() req,
    @Param()
    { projectId, subProjectId, pmType }: GetAllPreventiveMaintenanceParamsDto,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
      assetId = null,
      areaId = null,
      assetName = null,
      areaName = null,
      status = null,
      assignees = null,
      approvers = null,
      teamMembers = null,
      createdById = null,
      search = null,
      assetType = null,
      dueDate = null,
      projectIds = null,
      taskCategory = null,
    }: GetAllPreventiveMaintenanceQueryDto,
  ): Promise<GetAllPreventiveMaintenanceResponseDto> {
    return this.preventiveMaintenancesService.findAll(
      req.user,
      projectId,
      projectIds,
      subProjectId,
      pmType,
      orderField,
      orderBy,
      assetId,
      areaId,
      assetName,
      areaName,
      status,
      assignees,
      approvers,
      teamMembers,
      createdById,
      search,
      assetType,
      taskCategory,
      dueDate,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @ApiOkResponse({
    type: GetAllPreventiveMaintenanceResponseDto,
  })
  @Get('v2/:projectId/:subProjectId/:startDate/:endDate')
  findAllByDueDateWithProjectV2(
    @Req() req,
    @Query('global') global: string,
    @Query('isRecordExist') isRecordExist: string,
    @Query('pmType') pmType: string,
    @Param()
    {
      projectId,
      subProjectId,
      startDate,
      endDate,
    }: GetAllByDueDateWithProjectPMParamsDto,
  ): Promise<GetAllPreventiveMaintenanceResponseDto> {
    return this.preventiveMaintenancesService.findAllByDueDateV2(
      req.user,
      startDate,
      endDate,
      projectId,
      subProjectId,
      global,
      pmType,
      isRecordExist,
    );
  }

  @ApiOkResponse({
    type: GetAllPreventiveMaintenanceResponseDto,
  })
  @Get(':projectId/:subProjectId/:startDate/:endDate')
  findAllByDueDateWithProject(
    @Req() req,
    @Param()
    {
      projectId,
      subProjectId,
      startDate,
      endDate,
    }: GetAllByDueDateWithProjectPMParamsDto,
  ): Promise<GetAllPreventiveMaintenanceResponseDto> {
    return this.preventiveMaintenancesService.findAllByDueDate(
      req.user,
      startDate,
      endDate,
      projectId,
      subProjectId,
    );
  }
}
