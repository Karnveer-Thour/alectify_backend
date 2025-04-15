import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AssetsService } from '../assets/assets.service';
import { IncidentReportAsset } from './entities/incident-report-assets.entity';
import { IncidentReportAssetsRepository } from './repositories/incident-report-assets.repository';
import { CreateIncidentAssetResponseDto } from './dto/create-incident-report-asset-response.dto';

@Injectable()
export class IncidentReportAssetsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly assetsService: AssetsService,
    private readonly irAssetsRepository: IncidentReportAssetsRepository,
  ) {}

  async setAssetsForIncidentReport(
    incidentReportId: string,
    assetIds: string[],
    isNew = false,
  ): Promise<CreateIncidentAssetResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      // Validate that all assetIds exist
      // const assets = await this.assetsService.findByIds(assetIds);
      // if (assets.length !== assetIds.length) {
      //   throw new BadRequestException('One or more assets do not exist');
      // }

      // Delete existing associations unless it's a new report
      if (!isNew) {
        await manager.delete(IncidentReportAsset, {
          incidentReport: { id: incidentReportId },
        });
      }

      // Create new associations for the provided assetIds
      // const newAssociations = assets.map((asset) =>
      //   this.irAssetsRepository.create({
      //     asset,
      //     incidentReport: { id: incidentReportId },
      //   }),
      // );

      // Insert the new associations in bulk
      await manager.insert(
        IncidentReportAsset,
        assetIds.map((assetId) => ({
          asset: { id: assetId },
          incidentReport: { id: incidentReportId },
        })),
      );
      // const assetNames = assets.map((asset) => asset.name);

      return {
        message: `Incident report updated with ${assetIds.length} assets.`,
        // data: { asset: assetNames },
        data: {},
      };
    });
  }
}
