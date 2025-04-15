import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCommentParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  subProjectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  referenceId: string;
}
