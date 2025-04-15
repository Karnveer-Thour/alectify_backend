import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePreventiveMaintenanceAssetDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  assetId: string;
}
