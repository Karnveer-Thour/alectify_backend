import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Statuses } from '../models/status.enum';
import { PMTypeParamsDto } from './pm-type-preventive-maintenance.dto';
import { AssetTypes } from '../models/asset-types.enum';
import { DueDateDelayFilters } from '../models/due-date-filter.enum';
import { TaskCategories } from '../models/task-categories.enum';

export class GetAllPreventiveMaintenanceQueryDto {
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
    type: [Statuses],
  })
  @IsOptional()
  status: Statuses | Statuses[];

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
  @IsEnum(AssetTypes)
  assetType: AssetTypes;

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
}

export class GetAllPreventiveMaintenanceParamsDto extends PMTypeParamsDto {
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

export class GetAllCountPreventiveMaintenanceParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subProjectId: string;
}
