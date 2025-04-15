import { ApiProperty } from '@nestjs/swagger';

export class CreatePreventiveMaintenanceManyCSVDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
