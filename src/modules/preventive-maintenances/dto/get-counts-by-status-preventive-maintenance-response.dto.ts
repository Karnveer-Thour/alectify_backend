import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

class GetCountsByStatus {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  pmInternal: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  pmExternal: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  task: number;
}

export class GetCountsByStatusPreventiveMaintenanceResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: GetCountsByStatus;
}
