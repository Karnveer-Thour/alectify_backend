import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { PMTypes } from 'modules/preventive-maintenances/models/pm-types.enum';
import { User } from 'modules/users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { ContentTypes } from '../models/content-types';

export class CreateCommentResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: Comment;
}

export class DjangoComment {
  @ApiProperty()
  @IsString()
  @IsEnum(ContentTypes)
  content_type: string;

  @ApiProperty()
  @IsString()
  created_at: Date;

  @ApiProperty()
  @IsString()
  file_name: string;

  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNumber()
  is_active: number;

  @ApiProperty()
  @IsBoolean()
  is_system_generated: boolean;

  @ApiProperty()
  @IsString()
  project: string;

  @ApiProperty()
  @IsString()
  reference_id: string;

  @ApiProperty()
  @IsString()
  @IsEnum(PMTypes)
  reference_type: string;

  @ApiProperty()
  @IsString()
  s3_key: string;

  @ApiProperty()
  @IsString()
  s3_url: string;

  @ApiProperty()
  @IsObject()
  sent_by: any; //@TODO: add shorter version of user type

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  updated_at: Date;
}

export class CreateCommentDjangoResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: DjangoComment | DjangoComment[];
}
