import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusManageOrder {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date: Date;
}
