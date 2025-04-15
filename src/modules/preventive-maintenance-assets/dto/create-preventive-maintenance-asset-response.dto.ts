import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { MasterPreventiveMaintenanceAssets } from '../entities/master-preventive-maintenance-assets.entity';
import { PreventiveMaintenanceAssets } from '../entities/preventive-maintenance-assets.entity';

export class CreatePreventiveMaintenanceAssetResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: {
    asset: PreventiveMaintenanceAssets | MasterPreventiveMaintenanceAssets;
  };
}
