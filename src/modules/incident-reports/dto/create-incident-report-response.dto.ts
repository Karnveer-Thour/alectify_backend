import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { IncidentReport } from '../entities/incident-report.entity';

export class CreateIncidentReportResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: IncidentReport;
}
