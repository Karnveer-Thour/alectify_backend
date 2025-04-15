import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export enum DocumentUploadedFromEnum {
  MESSAGING_CENTER = 'MESSAGING_CENTER',
}

export class CreatePreventiveMaintenanceDocumentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  subProjectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(DocumentUploadedFromEnum)
  from: DocumentUploadedFromEnum;
}
