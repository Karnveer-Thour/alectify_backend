import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StepOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  order: number;
}

export class UpdateOrderProcedureLibraryStepDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => StepOrderDto)
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'At least one element is required' })
  StepOrderDto: StepOrderDto[];
}
