import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { Services } from '../entities/service.entity';

export class GetAllServicesResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: Services[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}
