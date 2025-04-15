import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { MasterPreventiveMaintenanceAreas } from '../entities/master-preventive-maintenance-areas.entity';
import { PreventiveMaintenanceAreas } from '../entities/preventive-maintenance-areas.entity';

export class CreatePreventiveMaintenanceAreaResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: {
    area: PreventiveMaintenanceAreas | MasterPreventiveMaintenanceAreas;
  };
}
