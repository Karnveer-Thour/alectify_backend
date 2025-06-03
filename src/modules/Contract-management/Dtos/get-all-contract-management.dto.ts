import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { order_field } from '../models/order-field.enum';
import { order_by } from '../models/order_by.enum';

export class GetAllContractManagementQueryDto {
  @ApiProperty({
    required: false,
    minimum: 1,
    title: 'Page',
    format: 'int32',
    default: 1,
  })
  @IsOptional()
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  page: number;

  @ApiProperty({
    required: false,
    minimum: 2,
    maximum: 100,
    title: 'Limit',
    format: 'int32',
    default: 10,
  })
  @IsOptional()
  @Min(2)
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEnum(order_field)
  order_field: order_field;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEnum(order_by)
  order_by: order_by;

  @ApiProperty({
    required: false,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  is_recurring: boolean;

  @ApiProperty({
    required: false,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  is_active: boolean;
}
