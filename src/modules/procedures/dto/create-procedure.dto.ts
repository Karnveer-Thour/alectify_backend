import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

import { ProceduresLibrary } from '../entities/procedures-library-entity';
import { ProcedureSteps } from '../entities/procedure-steps-entity';
import { JobType } from '../models/job-type.enum';

export class CreateProcedureDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  projectId: string;

  @ApiProperty({
    enum: JobType,
  })
  @IsNotEmpty()
  @IsEnum(JobType)
  jobType: JobType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  fileUpload: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  comments: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  procedureLibrary: ProceduresLibrary;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one element is required' })
  procedureSteps: ProcedureSteps[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  imageUrl: string;
}
