import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateIncidentReportTeamMemberDto extends BaseResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
