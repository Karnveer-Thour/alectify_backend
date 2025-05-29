import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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
  organization_Name: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  contact_userId: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  comments: string;

  // @ApiProperty({
  //   required:false,
  // })
  // @IsOptional()
  // @IsString()
  // contract_amount:'ASC' | 'DESC';

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  order_field: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  order_by: 'ASC' | 'DESC';

  @ApiProperty({
    required: false,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value; // Let class-validator handle the error if invalid
  })
  is_recurring: boolean;
}
