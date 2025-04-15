import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DeleteDocumentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  deletedComment: string;
}
