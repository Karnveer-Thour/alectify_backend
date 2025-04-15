import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { TimelinesView } from '../entities/timelines-view.entity';

export class GetAllTimelinesResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: TimelinesView[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}
