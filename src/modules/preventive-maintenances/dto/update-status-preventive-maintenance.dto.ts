import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Statuses } from '../models/status.enum';

export class UpdateStatusPreventiveMaintenanceParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    enum: Statuses,
  })
  @IsNotEmpty()
  @IsEnum(Statuses)
  status: Statuses;
}

export class UpdateStatusPreventiveMaintenanceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  estimatedHours: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  estimatedCost: number;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  commentId: string;
}
