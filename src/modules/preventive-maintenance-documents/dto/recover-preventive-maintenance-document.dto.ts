import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RecoverAndUpdatePreventiveMaintenanceDocumentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  recoveredComment: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment: string;
}
