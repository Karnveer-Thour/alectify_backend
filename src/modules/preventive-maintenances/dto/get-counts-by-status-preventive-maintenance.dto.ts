import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsString,
  IsArray,
} from 'class-validator';
import { Statuses } from '../models/status.enum';

export class GetCountsByStatusPreventiveMaintenanceParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Statuses)
  status: Statuses;
}

export class GetCountsByStatusPreventiveMaintenanceQueryDto {
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

  @ApiProperty()
  @IsOptional()
  @IsString()
  startDate: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  endDate: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  projectIds: string[];
}
