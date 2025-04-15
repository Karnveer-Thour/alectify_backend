import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMailDto {
  @ApiProperty()
  @IsNotEmpty()
  to: string | string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  cc?: string | string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  bcc?: string | string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  attachments?: {
    filename: string;
    content: Buffer;
    encoding: string;
    mimeType: string;
  }[];
}
