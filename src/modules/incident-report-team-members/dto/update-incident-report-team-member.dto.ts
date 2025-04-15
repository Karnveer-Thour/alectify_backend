import { PartialType } from '@nestjs/swagger';
import { CreateIncidentReportTeamMemberDto } from './create-incident-report-team-member.dto';

export class UpdateIncidentReportTeamMemberDto extends PartialType(
  CreateIncidentReportTeamMemberDto,
) {}
