import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  subProjectId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  areaId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  assetId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  preventiveMaintenanceId: string;
}
