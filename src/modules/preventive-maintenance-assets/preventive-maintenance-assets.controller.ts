import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePreventiveMaintenanceAssetResponseDto } from './dto/create-preventive-maintenance-asset-response.dto';
import { CreatePreventiveMaintenanceAssetDto } from './dto/create-preventive-maintenance-asset.dto';
import { PreventiveMaintenanceAssetsService } from './preventive-maintenance-assets.service';
@ApiBearerAuth()
@ApiTags('Preventive Maintenance Assets')
@Controller('pm-assets')
export class PreventiveMaintenanceAssetsController {
  constructor(
    private readonly pmAssetervice: PreventiveMaintenanceAssetsService,
  ) {}

  @ApiCreatedResponse({
    type: CreatePreventiveMaintenanceAssetResponseDto,
  })
  @Post(':preventiveMaintenanceId')
  create(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Body() createPMAssetDto: CreatePreventiveMaintenanceAssetDto,
  ): Promise<CreatePreventiveMaintenanceAssetResponseDto> {
    return this.pmAssetervice.create(pmId, createPMAssetDto);
  }

  @ApiOkResponse({
    type: CreatePreventiveMaintenanceAssetResponseDto,
  })
  @Delete(':preventiveMaintenanceId/:assetId')
  remove(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Param('assetId') assetId: string,
  ): Promise<CreatePreventiveMaintenanceAssetResponseDto> {
    return this.pmAssetervice.remove(pmId, assetId);
  }

  @ApiCreatedResponse({
    type: CreatePreventiveMaintenanceAssetResponseDto,
  })
  @Post('master/:masterPreventiveMaintenanceId')
  createForMaster(
    @Req() req,
    @Param('masterPreventiveMaintenanceId') masterPmId: string,
    @Body() createPMAssetDto: CreatePreventiveMaintenanceAssetDto,
  ): Promise<CreatePreventiveMaintenanceAssetResponseDto> {
    return this.pmAssetervice.createForMaster(masterPmId, createPMAssetDto);
  }

  @ApiOkResponse({
    type: CreatePreventiveMaintenanceAssetResponseDto,
  })
  @Delete('master/:preventiveMaintenanceId/:assetId')
  removeForMaster(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Param('assetId') assetId: string,
  ): Promise<CreatePreventiveMaintenanceAssetResponseDto> {
    return this.pmAssetervice.removeForMaster(pmId, assetId);
  }
}
