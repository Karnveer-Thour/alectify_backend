import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class PendingItemsCount {
  @ApiProperty()
  @IsString()
  pendingItems: string;
}

export class GetPendingItemsCountResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: PendingItemsCount;
}
