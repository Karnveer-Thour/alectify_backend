import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DeletePreventiveMaintenanceDocumentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  deletedComment: string;
}
