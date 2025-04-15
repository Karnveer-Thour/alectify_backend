import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAllTimelinesResponseDto } from './dto/get-all-timelines-response.dto';
import { GetAllTimelinesQueryDto } from './dto/get-timelines.dto';
import { TimelinesService } from './timelines.service';

@ApiBearerAuth()
@ApiTags('Timelines')
@Controller('timelines')
export class TimelinesController {
  constructor(private readonly timelinesService: TimelinesService) {}

  @Get(':id')
  findDrawHistoriesByAssetOrArea(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Query()
    {
      startDate = null,
      endDate = null,
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
    }: GetAllTimelinesQueryDto,
  ): Promise<GetAllTimelinesResponseDto> {
    return this.timelinesService.findDrawHistoriesByAssetOrArea(
      id,
      startDate,
      endDate,
      orderField,
      orderBy,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }
}
