import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class ImportFilesDto {
  @IsString()
  @IsOptional()
  fileName: string;

  @IsString()
  @IsOptional()
  filePath: string;

  @IsString()
  @IsOptional()
  fileType: string;

  @IsString()
  @IsOptional()
  uploadedBy: string;
}

export class CreateMasterPreventiveMaintenanceDocumentDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportFilesDto)
  importFiles: ImportFilesDto[];
}

export class CreateMasterPreventiveMaintenanceUploadDto {
  @IsArray()
  images: Express.Multer.File[];
  @IsArray()
  files: Express.Multer.File[];
}
