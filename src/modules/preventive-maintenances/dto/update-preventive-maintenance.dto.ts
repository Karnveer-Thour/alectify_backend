import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { DayTypes } from '../models/day-types.enum';
import { Days } from '../models/days.enum';
import { TaskCategories } from '../models/task-categories.enum';
import { Weeks } from '../models/weeks.enum';
import { FrequencyTypes } from '../models/frequency-types.enum';
import { Priorities } from '../models/priorities.enum';
import { Type } from 'class-transformer';

class ImportFilesDto {
  @IsString()
  @IsOptional()
  fileName: string;

  @IsString()
  @IsOptional()
  filePath: string;

  @IsString()
  @IsOptional()
  fileType: string;

  @IsString()
  @IsOptional()
  uploadedBy: string;
}

export class UpdatePreventiveMaintenanceDto {
  @ApiProperty()
  @IsOptional()
  procedureLibraryId: string;

  // @ApiProperty()
  // @IsOptional()
  // @IsUUID()
  // assetId: string;

  // @ApiProperty()
  // @IsOptional()
  // @IsUUID()
  // areaId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  preferredSupplierId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  teamId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  workTitle: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  detail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dueDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contractEndDate: Date;

  @ApiProperty({
    enum: FrequencyTypes,
  })
  @IsOptional()
  @IsEnum(FrequencyTypes)
  frequencyType: FrequencyTypes;

  @ApiProperty()
  @IsOptional()
  @IsString()
  frequency: string;

  @ApiProperty({
    enum: DayTypes,
  })
  @IsOptional()
  @IsEnum(DayTypes)
  dayType: DayTypes;

  @ApiProperty()
  @IsOptional()
  @IsString()
  date: string;

  @ApiProperty({
    enum: Weeks,
  })
  @IsOptional()
  @IsEnum(Weeks)
  week: Weeks;

  @ApiProperty({
    enum: Days,
  })
  @IsOptional()
  @IsEnum(Days)
  day: Days;

  @ApiProperty({
    enum: TaskCategories,
  })
  @IsOptional()
  @IsEnum(TaskCategories)
  taskCategory: TaskCategories;

  @ApiProperty({
    enum: Priorities,
  })
  @IsOptional()
  @IsEnum(Priorities)
  priority: Priorities;

  @ApiProperty()
  @IsNotEmpty()
  changeAllFuturePM: string;

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  assignees: string[];

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsOptional()
  approvers: string[];

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsOptional()
  teamMembers: string[];

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsOptional()
  assetIds: string[];

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsOptional()
  areaIds: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportFilesDto)
  importFiles: ImportFilesDto[];

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsOptional()
  deletedFilesIds: string[];

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsOptional()
  deletedImagesIds: string[];
}
