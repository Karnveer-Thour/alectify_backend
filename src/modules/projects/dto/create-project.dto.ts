import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateSubProjectDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  mainProjectId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  subProjectId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
}

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  mainProjectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    type: CreateSubProjectDto,
  })
  @IsObject()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubProjectDto)
  subProject: CreateSubProjectDto;
}
