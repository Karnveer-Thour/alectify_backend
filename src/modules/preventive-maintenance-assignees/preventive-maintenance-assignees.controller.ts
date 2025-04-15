import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePreventiveMaintenanceAssigneeResponseDto } from './dto/create-preventive-maintenance-assignee-response.dto';
import { CreatePreventiveMaintenanceAssigneeDto } from './dto/create-preventive-maintenance-assignee.dto';
import { PreventiveMaintenanceAssigneesService } from './preventive-maintenance-assignees.service';
@ApiBearerAuth()
@ApiTags('Preventive Maintenance Assignees')
@Controller('pm-assignees')
export class PreventiveMaintenanceAssigneesController {
  constructor(
    private readonly pmAssigneesService: PreventiveMaintenanceAssigneesService,
  ) {}

  @ApiCreatedResponse({
    type: CreatePreventiveMaintenanceAssigneeResponseDto,
  })
  @Post(':preventiveMaintenanceId')
  create(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Body() createPMAssigneeDto: CreatePreventiveMaintenanceAssigneeDto,
  ): Promise<CreatePreventiveMaintenanceAssigneeResponseDto> {
    return this.pmAssigneesService.create(pmId, createPMAssigneeDto, req.user);
  }

  @ApiOkResponse({
    type: CreatePreventiveMaintenanceAssigneeResponseDto,
  })
  @Delete(':preventiveMaintenanceId/:userId')
  remove(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Param('userId') userId: string,
  ): Promise<CreatePreventiveMaintenanceAssigneeResponseDto> {
    return this.pmAssigneesService.remove(pmId, userId, req.user);
  }

  @ApiCreatedResponse({
    type: CreatePreventiveMaintenanceAssigneeResponseDto,
  })
  @Post('master/:masterPreventiveMaintenanceId')
  createForMaster(
    @Req() req,
    @Param('masterPreventiveMaintenanceId') masterPmId: string,
    @Body() createPMAssigneeDto: CreatePreventiveMaintenanceAssigneeDto,
  ): Promise<CreatePreventiveMaintenanceAssigneeResponseDto> {
    return this.pmAssigneesService.createForMaster(
      masterPmId,
      createPMAssigneeDto,
      req.user,
    );
  }

  @ApiOkResponse({
    type: CreatePreventiveMaintenanceAssigneeResponseDto,
  })
  @Delete('master/:preventiveMaintenanceId/:userId')
  removeForMaster(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Param('userId') userId: string,
  ): Promise<CreatePreventiveMaintenanceAssigneeResponseDto> {
    return this.pmAssigneesService.removeForMaster(pmId, userId, req.user);
  }
}
