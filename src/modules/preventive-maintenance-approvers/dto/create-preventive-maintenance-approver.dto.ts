import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePreventiveMaintenanceApproverDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
