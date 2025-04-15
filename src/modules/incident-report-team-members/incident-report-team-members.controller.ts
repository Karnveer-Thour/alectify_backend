import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { IncidentReportTeamMembersService } from './incident-report-team-members.service';
import { CreateIncidentReportTeamMemberDto } from './dto/create-incident-report-team-member.dto';
import { UpdateIncidentReportTeamMemberDto } from './dto/update-incident-report-team-member.dto';
import { CreateIncidentReportTeamMemberResponseDto } from './dto/create-incident-report-team-member-response.dto';

@Controller('incident-report-team-members')
export class IncidentReportTeamMembersController {
  constructor(
    private readonly incidentReportTeamMembersService: IncidentReportTeamMembersService,
  ) {}

  @ApiCreatedResponse({
    type: CreateIncidentReportTeamMemberResponseDto,
  })
  @Post(':incidentReportId')
  create(
    @Req() req,
    @Param('incidentReportId') irId: string,
    @Body()
    createIncidentReportTeamMemberDto: CreateIncidentReportTeamMemberDto,
  ): Promise<CreateIncidentReportTeamMemberResponseDto> {
    return this.incidentReportTeamMembersService.create(
      irId,
      createIncidentReportTeamMemberDto,
      req.user,
    );
  }
}
