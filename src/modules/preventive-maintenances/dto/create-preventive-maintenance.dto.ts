import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
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

export class CreatePreventiveMaintenanceDto {
  @ApiProperty()
  @IsOptional()
  procedureLibraryId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  subProjectId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  assetId: string;

  @ApiProperty()
  @IsOptional()
  areaId: string;

  @ApiProperty({
    type: [String],
  })
  @IsOptional()
  @IsArray()
  assetIds: string[];

  @ApiProperty({
    type: [String],
  })
  @IsOptional()
  @IsArray()
  areaIds: string[];

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

  @ApiProperty()
  @IsNotEmpty()
  isRecurring: string;

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
    enum: Priorities,
  })
  @IsOptional()
  @IsEnum(Priorities)
  priority: Priorities;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportFilesDto)
  importFiles: ImportFilesDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportFilesDto)
  importImages: ImportFilesDto[];
}

export class CreatePreventiveMaintenanceDocumentsDto {
  @IsArray()
  images: Express.Multer.File[];
  @IsArray()
  files: Express.Multer.File[];
}
