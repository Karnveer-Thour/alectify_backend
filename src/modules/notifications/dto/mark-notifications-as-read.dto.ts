import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class MarkNotificationAsReadDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  ids: string[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isSystemGenerated: boolean;
}
