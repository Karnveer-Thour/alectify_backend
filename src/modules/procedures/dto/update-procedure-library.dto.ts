import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProcedureLibraryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  projectId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsNotEmpty()
  fileUpload: boolean;

  @ApiProperty()
  @IsNotEmpty()
  comments: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryName: string;

  @ApiProperty()
  @IsOptional()
  procedureSteps: any;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image: string;
}
