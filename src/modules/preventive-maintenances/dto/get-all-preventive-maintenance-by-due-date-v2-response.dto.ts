import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class GetAllPreventiveMaintenanceByDueDateV2ResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsArray()
  data: any[];
}
