import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApplicationTypes } from '../models/application-types.enum';

export class GetAllApplicationVersionsQueryDto {
  @ApiProperty({
    enum: ApplicationTypes,
    required: false,
  })
  @IsEnum(ApplicationTypes)
  @IsOptional()
  applicationType: ApplicationTypes;
}
