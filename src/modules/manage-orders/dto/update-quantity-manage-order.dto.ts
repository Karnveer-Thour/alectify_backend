import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class UpdateQuantityManageOrder {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  subProjectId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  assetId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  areaId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  preventiveMaintenanceId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comments: string;
}
