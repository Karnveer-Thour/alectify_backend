import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { GetAdvisorySummaryDto } from './get-spare-parts-advisory-summary.dto';

export class GetAdvisorySummariesResponseDto extends BaseResponseDto {
  @ApiProperty({ type: [GetAdvisorySummaryDto] })
  @IsArray()
  data: GetAdvisorySummaryDto[];
}
