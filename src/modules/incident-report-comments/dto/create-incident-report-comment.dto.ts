import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateIncidentReportCommentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  actions: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  systemState: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  callAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nextUpdateAt: Date;
}
