import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePreventiveMaintenanceTeamMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
