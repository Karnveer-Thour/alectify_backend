import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { ManageOrder } from '../entities/manage-order.entity';

export class CreateManagePartResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ManageOrder;
}
