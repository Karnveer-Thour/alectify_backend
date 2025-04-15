import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { ProceduresLibrary } from '../entities/procedures-library-entity';

export class GetAllProcedureLibraryResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ProceduresLibrary[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}
