import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { ProjectSparePart } from '../entities/project-spare-part.entity';

export class GetAllSparePartsResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ProjectSparePart[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}
