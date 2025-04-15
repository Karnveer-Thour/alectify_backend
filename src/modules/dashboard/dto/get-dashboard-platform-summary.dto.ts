import { IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@common/dto/base-response.dto';

export class DashboardPlatformSummary {
  @ApiProperty()
  @IsNumber()
  totalAssets: number;

  @ApiProperty()
  @IsNumber()
  totalSites: number;

  @ApiProperty()
  @IsNumber()
  totalProcedures: number;

  @ApiProperty()
  @IsNumber()
  totalDocuments: number;
}

export class GetDashboardPlatformSummaryResponse extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: DashboardPlatformSummary;
}
