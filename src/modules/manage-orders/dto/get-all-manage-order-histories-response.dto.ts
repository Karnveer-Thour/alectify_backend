import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { ManageOrderHistory } from '../entities/manage-order-history.entity';

export class GetAllManageOrderHistoriesResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ManageOrderHistory[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}
