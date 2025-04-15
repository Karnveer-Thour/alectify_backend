import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePreventiveMaintenanceAreaResponseDto } from './dto/create-preventive-maintenance-area-response.dto';
import { CreatePreventiveMaintenanceAreaDto } from './dto/create-preventive-maintenance-area.dto';
import { PreventiveMaintenanceAreasService } from './preventive-maintenance-areas.service';
@ApiBearerAuth()
@ApiTags('Preventive Maintenance Areas')
@Controller('pm-areas')
export class PreventiveMaintenanceAreasController {
  constructor(
    private readonly pmAreasService: PreventiveMaintenanceAreasService,
  ) {}

  @ApiCreatedResponse({
    type: CreatePreventiveMaintenanceAreaResponseDto,
  })
  @Post(':preventiveMaintenanceId')
  create(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Body() createPMAreaDto: CreatePreventiveMaintenanceAreaDto,
  ): Promise<CreatePreventiveMaintenanceAreaResponseDto> {
    return this.pmAreasService.create(pmId, createPMAreaDto);
  }

  @ApiOkResponse({
    type: CreatePreventiveMaintenanceAreaResponseDto,
  })
  @Delete(':preventiveMaintenanceId/:areaId')
  remove(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Param('areaId') areaId: string,
  ): Promise<CreatePreventiveMaintenanceAreaResponseDto> {
    return this.pmAreasService.remove(pmId, areaId);
  }

  @ApiCreatedResponse({
    type: CreatePreventiveMaintenanceAreaResponseDto,
  })
  @Post('master/:masterPreventiveMaintenanceId')
  createForMaster(
    @Req() req,
    @Param('masterPreventiveMaintenanceId') masterPmId: string,
    @Body() createPMAreaDto: CreatePreventiveMaintenanceAreaDto,
  ): Promise<CreatePreventiveMaintenanceAreaResponseDto> {
    return this.pmAreasService.createForMaster(masterPmId, createPMAreaDto);
  }

  @ApiOkResponse({
    type: CreatePreventiveMaintenanceAreaResponseDto,
  })
  @Delete('master/:preventiveMaintenanceId/:areaId')
  removeForMaster(
    @Req() req,
    @Param('preventiveMaintenanceId') pmId: string,
    @Param('areaId') areaId: string,
  ): Promise<CreatePreventiveMaintenanceAreaResponseDto> {
    return this.pmAreasService.removeForMaster(pmId, areaId);
  }
}
