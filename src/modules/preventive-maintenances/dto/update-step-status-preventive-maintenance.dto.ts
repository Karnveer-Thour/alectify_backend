import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateStepStatusPreventiveMaintenanceParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class UpdateStepStatusPreventiveMaintenanceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  stepId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  durationMins: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comments: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image: string;
}

export class UpdateAllStepStatusPreventiveMaintenanceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
