import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateManageOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  estimatedDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  orderedDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  poNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comments: string;
}
