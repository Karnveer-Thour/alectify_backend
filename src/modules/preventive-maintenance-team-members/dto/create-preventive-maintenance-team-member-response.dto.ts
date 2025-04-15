import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { MasterPreventiveMaintenanceTeamMembers } from '../entities/master-preventive-maintenance-team-members.entity';
import { PreventiveMaintenanceTeamMembers } from '../entities/preventive-maintenance-team-members.entity';

export class CreatePreventiveMaintenanceTeamMemberResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: {
    teamMember:
      | PreventiveMaintenanceTeamMembers
      | MasterPreventiveMaintenanceTeamMembers;
  };
}
