import {
  IsOptional,
  IsString,
  IsObject,
  IsEnum,
  IsNumber,
  Min,
  IsNotEmpty,
  ValidateIf,
  IsArray,
} from 'class-validator';
import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { MasterPreventiveMaintenances } from '../entities/master-preventive-maintenances.entity';
import { Type } from 'class-transformer';
import { DueDateDelayFilters } from '../models/due-date-filter.enum';
import { Statuses } from '../models/status.enum';
import { PMTypes } from '../models/pm-types.enum';
import { TaskCategories } from '../models/task-categories.enum';
import { PMTypeParamsDto } from './pm-type-preventive-maintenance.dto';

export class GetAllMasterPreventiveMaintenanceParamsDto extends PMTypeParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subProjectId: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  projectIds: string[];
}
export class GetAllMasterPreventiveMaintenanceResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: MasterPreventiveMaintenances[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}

export class GetAllMasterPreventiveMaintenanceQueryDto {
  @ApiProperty({
    required: false,
    minimum: 1,
    title: 'Page',
    format: 'int32',
    default: 1,
  })
  @IsOptional()
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  page: number;

  @ApiProperty({
    required: false,
    minimum: 2,
    maximum: 100,
    title: 'Limit',
    format: 'int32',
    default: 10,
  })
  @IsOptional()
  @Min(2)
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  orderField: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  orderBy: 'ASC' | 'DESC';

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  assetId: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  areaId: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  assetName: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  areaName: string;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  assignees: string | string[];

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  approvers: string | string[];

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  teamMembers: string | string[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  createdById: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskCategories)
  taskCategory: TaskCategories;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEnum(DueDateDelayFilters)
  dueDate: DueDateDelayFilters;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  projectIds: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  projectId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  subProjectId: string;

  @ApiProperty()
  @IsOptional()
  isRecurring: string;

  @ApiProperty({
    enum: PMTypes,
  })
  @ValidateIf((o, v) => v !== 'all')
  @IsOptional()
  @IsEnum(PMTypes)
  pmType: PMTypes;
}
