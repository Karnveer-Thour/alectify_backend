import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class CreateIncidentAssetResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: any;
}
