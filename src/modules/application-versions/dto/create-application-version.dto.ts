import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApplicationTypes } from '../models/application-types.enum';

export class CreateApplicationVersionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  version: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isForceUpdate: boolean;

  @ApiProperty({
    enum: ApplicationTypes,
  })
  @IsNotEmpty()
  @IsEnum(ApplicationTypes)
  applicationType: ApplicationTypes;
}
