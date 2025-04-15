import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { ApplicationVersion } from '../entities/application-version.entity';

export class CreateApplicationVersionResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ApplicationVersion;
}
