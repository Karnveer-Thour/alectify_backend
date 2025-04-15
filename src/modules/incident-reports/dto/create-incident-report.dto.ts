import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Priorities } from 'modules/preventive-maintenances/models/priorities.enum';
import { IncidentTypes } from '../models/type.enum';

export class CreateIncidentReportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  subProjectId: string;

  @ApiProperty({
    enum: IncidentTypes,
  })
  @IsEnum(IncidentTypes)
  type: IncidentTypes;

  @ApiProperty()
  @IsOptional()
  incidentNo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  emailToClient: string;

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
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(Priorities)
  priority: Priorities;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  teamId: string;

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsOptional()
  teamMembers: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  incidentDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  isDraft: string;

  @IsObject()
  @IsArray()
  @IsOptional()
  documents: Express.Multer.File[];

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  affectedSystemId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  impactId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  actions: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  systemState: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  callAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nextUpdateAt: Date;
}
