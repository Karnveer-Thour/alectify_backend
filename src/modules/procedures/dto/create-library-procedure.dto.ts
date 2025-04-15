import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { JobType } from '../models/job-type.enum';

export class CreateProcedureLibraryDto {
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
  fileUpload: boolean;

  @ApiProperty()
  @IsNotEmpty()
  comments: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryName: string;

  @ApiProperty()
  @IsOptional()
  procedureSteps: any;
}
