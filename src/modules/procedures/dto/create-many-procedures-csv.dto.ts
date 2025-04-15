import { ApiProperty } from '@nestjs/swagger';

export class CreateManyProceduresCSVDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
