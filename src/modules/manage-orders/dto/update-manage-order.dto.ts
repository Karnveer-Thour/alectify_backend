import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateManageOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  estimatedDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderedDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comments: string;
}
