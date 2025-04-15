import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  CreateAffectedSystemDto,
  BulkCreateAffectedSystemDto,
} from './dto/incident-report-affected-system.dto';
import {
  CreateImpactDto,
  BulkCreateImpactDto,
} from './dto/incident-report-impact.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(':projectId/affected-systems')
  async getAffectedSystems(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.projectsService.findAllAffectedSystems(projectId);
  }

  @Post('affected-systems')
  async createAffectedSystem(@Body() dto: CreateAffectedSystemDto) {
    return this.projectsService.createAffectedSystem(dto);
  }

  @Get(':projectId/impacts')
  async getImpacts(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.projectsService.findAllImpacts(projectId);
  }

  @Post('impacts')
  async createImpact(@Body() dto: CreateImpactDto) {
    return this.projectsService.createImpact(dto);
  }

  @Post(':projectId/affected-systems/bulk-upload')
  async bulkCreateAffectedSystems(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: BulkCreateAffectedSystemDto[],
  ) {
    return this.projectsService.bulkCreateAffectedSystems(projectId, dto);
  }

  @Post(':projectId/impacts/bulk-upload')
  async bulkCreateImpacts(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: BulkCreateImpactDto[],
  ) {
    return this.projectsService.bulkCreateImpacts(projectId, dto);
  }
}
