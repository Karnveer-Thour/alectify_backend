import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { ManageOrder } from '../entities/manage-order.entity';

export class GetAllManageOrdersResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ManageOrder[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}
