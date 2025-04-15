import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { MasterPreventiveMaintenanceAssignees } from '../entities/master-preventive-maintenance-assignees.entity';
import { PreventiveMaintenanceAssignees } from '../entities/preventive-maintenance-assignees.entity';

export class CreatePreventiveMaintenanceAssigneeResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: {
    assignee:
      | PreventiveMaintenanceAssignees
      | MasterPreventiveMaintenanceAssignees;
  };
}
