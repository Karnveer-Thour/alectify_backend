import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetAdvisorySummaryDto {
  @IsBoolean()
  isAdvisory: boolean;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  preferredSupplierName?: string;

  @IsString()
  @IsOptional()
  partNumber?: string;

  @IsString()
  @IsOptional()
  projectName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  system?: string;

  @IsString()
  @IsOptional()
  category?: string;
}
