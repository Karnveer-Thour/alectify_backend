import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePreventiveMaintenanceAreaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  areaId: string;
}
