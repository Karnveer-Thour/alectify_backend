import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { IncidentReportStatuses } from '../models/status.enum';

export class StatusUpdateIncidentReportDto {
  @ApiProperty({
    enum: IncidentReportStatuses,
  })
  @IsOptional()
  @IsEnum(IncidentReportStatuses)
  status: IncidentReportStatuses;
}
