import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePreventiveMaintenanceTeamMemberResponseDto } from './dto/create-preventive-maintenance-team-member-response.dto';
import { CreatePreventiveMaintenanceTeamMemberDto } from './dto/create-preventive-maintenance-team-member.dto';
import { PreventiveMaintenanceTeamMembersService } from './preventive-maintenance-team-members.service';
@ApiBearerAuth()
@ApiTags('Preventive Maintenance Team Members')
@Controller('pm-team-members')
export class PreventiveMaintenanceTeamMembersController {
  constructor(
    private readonly pmTeamMembersService: PreventiveMaintenanceTeamMembersService,
  ) {}

  @ApiCreatedResponse({
    type: CreatePreventiveMaintenanceTeamMemberResponseDto,
  })
  @Post(':preventiveMaintenanceId')
  create(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Body() createPMTeamMemberDto: CreatePreventiveMaintenanceTeamMemberDto,
  ): Promise<CreatePreventiveMaintenanceTeamMemberResponseDto> {
    return this.pmTeamMembersService.create(
      pmId,
      createPMTeamMemberDto,
      req.user,
    );
  }

  @ApiOkResponse({
    type: CreatePreventiveMaintenanceTeamMemberResponseDto,
  })
  @Delete(':preventiveMaintenanceId/:userId')
  remove(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Param('userId') userId: string,
  ): Promise<CreatePreventiveMaintenanceTeamMemberResponseDto> {
    return this.pmTeamMembersService.remove(pmId, userId, req.user);
  }

  @ApiCreatedResponse({
    type: CreatePreventiveMaintenanceTeamMemberResponseDto,
  })
  @Post('master/:masterPreventiveMaintenanceId')
  createForMaster(
    @Req() req,
    @Param('masterPreventiveMaintenanceId') masterPmId: string,
    @Body() createPMTeamMemberDto: CreatePreventiveMaintenanceTeamMemberDto,
  ): Promise<CreatePreventiveMaintenanceTeamMemberResponseDto> {
    return this.pmTeamMembersService.createForMaster(
      masterPmId,
      createPMTeamMemberDto,
      req.user,
    );
  }

  @ApiOkResponse({
    type: CreatePreventiveMaintenanceTeamMemberResponseDto,
  })
  @Delete('master/:preventiveMaintenanceId/:userId')
  removeForMaster(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Param('userId') userId: string,
  ): Promise<CreatePreventiveMaintenanceTeamMemberResponseDto> {
    return this.pmTeamMembersService.removeForMaster(pmId, userId, req.user);
  }
}
