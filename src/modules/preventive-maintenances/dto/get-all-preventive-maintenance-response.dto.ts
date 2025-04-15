import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { PreventiveMaintenances } from '../entities/preventive-maintenances.entity';

export class GetAllPreventiveMaintenanceResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: PreventiveMaintenances[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}
