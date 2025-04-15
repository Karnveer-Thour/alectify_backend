import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AreasService } from '../areas/areas.service';
import { IncidentReportArea } from './entities/incident-report-areas.entity';
import { IncidentReportAreasRepository } from './repositories/incident-report-areas.repository';
import { CreateIncidentAreaResponseDto } from './dto/create-incident-report-area-response.dto';

@Injectable()
export class IncidentReportAreasService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly areasService: AreasService,
    private readonly irAreasRepository: IncidentReportAreasRepository,
  ) {}

  async setAreasForIncidentReport(
    incidentReportId: string,
    areaIds: string[],
    isNew = false,
  ): Promise<CreateIncidentAreaResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      // Validate that all areaIds exist
      // const areas = await this.areasService.findByIds(areaIds);
      // if (areas.length !== areaIds.length) {
      //   throw new BadRequestException('One or more areas do not exist');
      // }

      // Skip deletion if it's a new incident report
      if (!isNew) {
        await manager.delete(IncidentReportArea, {
          incidentReport: { id: incidentReportId },
        });
      }

      // Create new associations
      // const newAssociations = areaIds.map((area) =>
      //   this.irAreasRepository.create({
      //     area,
      //     incidentReport: { id: incidentReportId },
      //   }),
      // );

      // Bulk insert the new associations
      await manager.save(
        IncidentReportArea,
        areaIds.map((areaId) => ({
          area: { id: areaId },
          incidentReport: { id: incidentReportId },
        })),
      );
      // const areaNames = areas.map((area) => area.name);

      return {
        message: `Incident report updated with ${areaIds.length} areas.`,
        // data: { area: areaNames },
        data: {},
      };
    });
  }
}
