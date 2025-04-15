import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';
import { IncidentReportArea } from '../entities/incident-report-areas.entity';

export class CreateIncidentAreaResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: any;
}
