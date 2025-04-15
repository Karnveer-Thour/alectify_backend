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
} from 'class-validator';
import { Priorities } from 'modules/preventive-maintenances/models/priorities.enum';
import { IncidentTypes } from '../models/type.enum';

export class UpdateIncidentReportDto {
  @ApiProperty({
    enum: IncidentTypes,
  })
  @IsEnum(IncidentTypes)
  type: IncidentTypes;

  @ApiProperty()
  @IsOptional()
  incidentNo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    enum: Priorities,
  })
  @IsOptional()
  @IsEnum(Priorities)
  priority: Priorities;

  @ApiProperty()
  @IsOptional()
  @IsString()
  incidentDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  affectedSystemId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  impactId: string;
}
