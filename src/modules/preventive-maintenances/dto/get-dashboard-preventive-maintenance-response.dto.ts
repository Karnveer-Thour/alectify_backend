import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

class GetDashboardCounts {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  onTimeCounts: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  sevenDaysDueCounts: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  sevenToFourteenDaysDueCounts: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  plusFourteenDaysDueCounts: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  openItems: any[];
}

export class GetDashboardResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: GetDashboardCounts;
}
