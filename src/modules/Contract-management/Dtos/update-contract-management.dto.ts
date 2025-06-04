import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ContractManagementDocumentDto } from './contract-management-document.dto';

export class UpdateContractManagementDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contractNumber?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  contractAmount?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  importedFiles?: ContractManagementDocumentDto[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  deletefilesIds?: string[];
}
