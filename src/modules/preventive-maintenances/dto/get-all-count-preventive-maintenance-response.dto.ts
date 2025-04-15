import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { PreventiveMaintenances } from '../entities/preventive-maintenances.entity';

export class GetAllCountPreventiveMaintenanceResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: object;
}
