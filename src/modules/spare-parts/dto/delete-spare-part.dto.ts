import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteSparePartDto {
  @ApiProperty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ArrayMinSize(1, { message: 'At least one element is required' })
  ids: string[];
}
