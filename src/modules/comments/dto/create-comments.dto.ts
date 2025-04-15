import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PMTypes } from 'modules/preventive-maintenances/models/pm-types.enum';
import { ContentTypes } from '../models/content-types';

export class CreateCommentsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  referenceId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  subProject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  sentBy: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsEnum(ContentTypes)
  @IsNotEmpty()
  contentType: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  s3Key: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsEnum(PMTypes)
  @IsNotEmpty()
  referenceType: PMTypes;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isSystemGenerated: boolean;
}

export class CreateCommentForAPIDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  sent_by: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty()
  @IsEnum(ContentTypes)
  @IsNotEmpty()
  content_type: string;

  @ApiProperty()
  @IsOptional()
  s3_key: string | string[];

  @ApiProperty()
  @IsOptional()
  file_name: string | string[];

  @ApiProperty()
  @IsEnum(PMTypes)
  @IsNotEmpty()
  reference_type: PMTypes;
}
