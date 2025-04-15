import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { IncidentReportTeamMembers } from '../entities/incident-report-team-members.entity';

export class CreateIncidentReportTeamMemberResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: {
    teamMember: IncidentReportTeamMembers;
  };
}
