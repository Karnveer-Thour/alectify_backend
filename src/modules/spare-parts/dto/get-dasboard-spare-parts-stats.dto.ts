import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SparePartDashboardStatsDto {
  @ApiProperty()
  @IsNumber()
  totalCost: number;

  @ApiProperty()
  @IsNumber()
  currentYearCost: number;

  @ApiProperty()
  @IsNumber()
  totalCount: number;

  @ApiProperty()
  @IsNumber()
  outOfStockCount: number;

  @ApiProperty()
  @IsNumber()
  lowInventoryCount: number;
  
  @ApiProperty()
  @IsNumber()
  drawTotal?: number;
  
  @ApiProperty()
  @IsNumber()
  reStockTotal?: number;
}

export class SparePartDashboardStatsResponseDto extends BaseResponseDto {
  data: SparePartDashboardStatsDto;
}

export class SparePartDashboardMonthlyHistoryDto {
  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiProperty()
  @IsString()
  month: string;

  @ApiProperty()
  @IsNumber()
  refillCount: number;

  @ApiProperty()
  @IsNumber()
  drawCount: number;
}

export class SparePartDashboardMonthlyHistoryResponseDto extends BaseResponseDto {
  data: SparePartDashboardMonthlyHistoryDto[];
}

export class SparePartsMonthlyCost {
  @ApiProperty()
  @IsString()
  month: string;

  @ApiProperty()
  @IsNumber()
  restockTotal: number;

  @ApiProperty()
  @IsNumber()
  drawTotal: number;
}

export class SparePartsMonthlyCostResponse {
  data: SparePartsMonthlyCost[];
}
