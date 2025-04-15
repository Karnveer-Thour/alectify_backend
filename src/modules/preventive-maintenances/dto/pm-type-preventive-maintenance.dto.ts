import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';
import { PMTypes } from '../models/pm-types.enum';

export class PMTypeParamsDto {
  @ApiProperty({
    enum: PMTypes,
  })
  @ValidateIf((o, v) => v !== 'all')
  @IsNotEmpty()
  @IsEnum(PMTypes)
  pmType: PMTypes;
}
