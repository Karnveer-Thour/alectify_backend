import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject } from 'class-validator';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { DocumentsView } from '../entities/documents-view.entity';
import { Documents } from '../entities/documents.entity';

export class GetDocumentsViewCount {
  @ApiProperty()
  @IsNumber()
  count: number;
}

export class GetAllDocumentsViewResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: DocumentsView[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}

export class GetDocumentsViewCountResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: GetDocumentsViewCount;

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}

export class GetAllDocumentsResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: Documents[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}
