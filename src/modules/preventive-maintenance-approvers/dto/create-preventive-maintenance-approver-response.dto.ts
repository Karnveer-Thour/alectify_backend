import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { MasterPreventiveMaintenanceApprovers } from '../entities/master-preventive-maintenance-approvers.entity';
import { PreventiveMaintenanceApprovers } from '../entities/preventive-maintenance-approvers.entity';

export class CreatePreventiveMaintenanceApproverResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: {
    approver:
      | PreventiveMaintenanceApprovers
      | MasterPreventiveMaintenanceApprovers;
  };
}
