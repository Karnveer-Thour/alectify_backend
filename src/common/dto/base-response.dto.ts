import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BaseResponseDto {
  @ApiProperty()
  @IsString()
  message: string;
}
