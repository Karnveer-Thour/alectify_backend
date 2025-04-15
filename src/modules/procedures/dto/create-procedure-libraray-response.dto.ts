import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { ProceduresLibrary } from '../entities/procedures-library-entity';

export class CreateProcedureLibraryResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ProceduresLibrary;
}
