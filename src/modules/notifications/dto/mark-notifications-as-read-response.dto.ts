import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@common/dto/base-response.dto';

export class MarkNotificationAsReadResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: string[];
}
