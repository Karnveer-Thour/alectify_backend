import { ApiOkResponse } from '@nestjs/swagger';
import { Controller, Get, Query, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetDashboardPlatformSummaryResponse } from './dto/get-dashboard-platform-summary.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOkResponse({
    type: GetDashboardPlatformSummaryResponse,
  })
  @Get('platform-summary')
  getPlatformSummary(
    @Req() req,
    @Query()
    { projectId = null }: { projectId: string },
  ): Promise<GetDashboardPlatformSummaryResponse> {
    return this.dashboardService.getPlatformSummary(projectId, req.user);
  }
}
