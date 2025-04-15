import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DeleteIncidentReportDocumentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  deletedComment: string;
}
