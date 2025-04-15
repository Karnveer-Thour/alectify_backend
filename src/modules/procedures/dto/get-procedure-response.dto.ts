import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { Procedures } from '../entities/procedures-entity';

export class GetProcedureResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: Procedures;
}
