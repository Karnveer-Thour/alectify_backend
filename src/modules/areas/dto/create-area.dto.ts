import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAreaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  mainProjectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  subProjectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  areaId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
}
