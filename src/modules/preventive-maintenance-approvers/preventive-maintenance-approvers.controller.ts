import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePreventiveMaintenanceApproverResponseDto } from './dto/create-preventive-maintenance-approver-response.dto';
import { CreatePreventiveMaintenanceApproverDto } from './dto/create-preventive-maintenance-approver.dto';
import { PreventiveMaintenanceApproversService } from './preventive-maintenance-approvers.service';
@ApiBearerAuth()
@ApiTags('Preventive Maintenance Approvers')
@Controller('pm-approvers')
export class PreventiveMaintenanceApproversController {
  constructor(
    private readonly pmApproversService: PreventiveMaintenanceApproversService,
  ) {}

  @ApiCreatedResponse({
    type: CreatePreventiveMaintenanceApproverResponseDto,
  })
  @Post(':preventiveMaintenanceId')
  create(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Body() createPMApproverDto: CreatePreventiveMaintenanceApproverDto,
  ): Promise<CreatePreventiveMaintenanceApproverResponseDto> {
    return this.pmApproversService.create(pmId, createPMApproverDto, req.user);
  }

  @ApiOkResponse({
    type: CreatePreventiveMaintenanceApproverResponseDto,
  })
  @Delete(':preventiveMaintenanceId/:userId')
  remove(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Param('userId') userId: string,
  ): Promise<CreatePreventiveMaintenanceApproverResponseDto> {
    return this.pmApproversService.remove(pmId, userId, req.user);
  }

  @ApiCreatedResponse({
    type: CreatePreventiveMaintenanceApproverResponseDto,
  })
  @Post('master/:masterPreventiveMaintenanceId')
  createForMaster(
    @Req() req,
    @Param('masterPreventiveMaintenanceId') masterPmId: string,
    @Body() createPMApproverDto: CreatePreventiveMaintenanceApproverDto,
  ): Promise<CreatePreventiveMaintenanceApproverResponseDto> {
    return this.pmApproversService.createForMaster(
      masterPmId,
      createPMApproverDto,
      req.user,
    );
  }

  @ApiOkResponse({
    type: CreatePreventiveMaintenanceApproverResponseDto,
  })
  @Delete('master/:preventiveMaintenanceId/:userId')
  removeForMaster(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Param('userId') userId: string,
  ): Promise<CreatePreventiveMaintenanceApproverResponseDto> {
    return this.pmApproversService.removeForMaster(pmId, userId, req.user);
  }
}
