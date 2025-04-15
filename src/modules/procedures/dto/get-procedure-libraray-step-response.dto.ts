import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { ProcedureLibrarySteps } from '../entities/procedure-library-steps-entity';

export class GetProcedureLibraryStepResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ProcedureLibrarySteps[];
}
