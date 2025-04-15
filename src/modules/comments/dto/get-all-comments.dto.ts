import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@common/dto/base-response.dto';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { Comment } from '../entities/comment.entity';

export class GetAllCommentsResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: Comment[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}
