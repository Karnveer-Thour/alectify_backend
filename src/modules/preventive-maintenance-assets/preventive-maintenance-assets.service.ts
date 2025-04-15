import { BaseResponseDto } from '@common/dto/base-response.dto';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MasterPreventiveMaintenances } from 'modules/preventive-maintenances/entities/master-preventive-maintenances.entity';
import { PreventiveMaintenances } from 'modules/preventive-maintenances/entities/preventive-maintenances.entity';
import { In } from 'typeorm';
import { AssetsService } from '../assets/assets.service';
import { PreventiveMaintenancesService } from '../preventive-maintenances/preventive-maintenances.service';
import { CreatePreventiveMaintenanceAssetResponseDto } from './dto/create-preventive-maintenance-asset-response.dto';
import { CreatePreventiveMaintenanceAssetDto } from './dto/create-preventive-maintenance-asset.dto';
import { MasterPreventiveMaintenanceAssets } from './entities/master-preventive-maintenance-assets.entity';
import { PreventiveMaintenanceAssets } from './entities/preventive-maintenance-assets.entity';
import { MasterPreventiveMaintenanceAssetsRepository } from './repositories/master-preventive-maintenance-assets.repository';
import { PreventiveMaintenanceAssetsRepository } from './repositories/preventive-maintenance-assets.repository';
import { dateToUTC } from '@common/utils/utils';

@Injectable()
export class PreventiveMaintenanceAssetsService {
  constructor(
    private pmAssetsRepository: PreventiveMaintenanceAssetsRepository,
    private masterPmAssetsRepository: MasterPreventiveMaintenanceAssetsRepository,
    @Inject(forwardRef(() => PreventiveMaintenancesService))
    private pmService: PreventiveMaintenancesService,
    private assetsService: AssetsService,
  ) {}

  async findAssetsByPMId(pm: PreventiveMaintenances) {
    return await this.pmAssetsRepository
      .createQueryBuilder('assets')
      .where('assets.preventiveMaintenance = :pmId', { pmId: pm.id })
      .leftJoinAndSelect('assets.asset', 'asset')
      .getMany();
  }

  async findAssetsByMasterPMId(pm: MasterPreventiveMaintenances) {
    return await this.masterPmAssetsRepository
      .createQueryBuilder('assets')
      .where('assets.masterPreventiveMaintenance = :pmId', { pmId: pm.id })
      .leftJoinAndSelect('assets.asset', 'asset')
      .getMany();
  }

  async create(
    pmId: string,
    createPMAssetDto: CreatePreventiveMaintenanceAssetDto,
  ): Promise<CreatePreventiveMaintenanceAssetResponseDto> {
    try {
      const isExist = await this.pmService.findOneByIdWithoutRelations(pmId);
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      const asset = await this.assetsService.findOneById(
        createPMAssetDto.assetId,
      );
      const isExistAsset = await this.pmAssetsRepository
        .createQueryBuilder('assets')
        .where('assets.asset = :assetId', { assetId: asset.id })
        .andWhere('assets.preventiveMaintenance = :pmId', { pmId })
        .getOne();

      if (isExistAsset) {
        throw new BadRequestException('Asset already exist');
      }
      const pmAsset = await this.pmAssetsRepository.save(
        new PreventiveMaintenanceAssets({
          asset: asset,
          preventiveMaintenance: isExist,
        }),
      );

      return {
        message: 'Asset added to preventive maintenance',
        data: { asset: pmAsset },
      };
    } catch (error) {
      throw error;
    }
  }

  async createMany(pmId: string, assetIds: string[]) {
    return Promise.all(
      assetIds.map(
        async (assetId) =>
          await this.create(pmId, {
            assetId,
          }),
      ),
    );
  }

  async createForMaster(
    masterPmId: string,
    createPMAssetDto: CreatePreventiveMaintenanceAssetDto,
  ): Promise<CreatePreventiveMaintenanceAssetResponseDto> {
    try {
      const [isExist, findCurrentPMs] = await Promise.all([
        this.pmService.masterFindOneById(masterPmId),
        this.pmService.findFutureAndCurrentPMs(masterPmId),
      ]);
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      const asset = await this.assetsService.findOneById(
        createPMAssetDto.assetId,
      );
      const isExistAssetForMaster = await this.masterPmAssetsRepository
        .createQueryBuilder('assets')
        .where('assets.asset = :assetId', { assetId: asset.id })
        .andWhere('assets.masterPreventiveMaintenance = :masterPmId', {
          masterPmId,
        })
        .getOne();
      if (isExistAssetForMaster) {
        throw new BadRequestException('Asset already exist');
      }
      if (findCurrentPMs.length) {
        await Promise.all(
          findCurrentPMs.map(async (pm) => {
            const isExistAsset = await this.pmAssetsRepository
              .createQueryBuilder('assets')
              .where('assets.asset = :assetId', { assetId: asset.id })
              .andWhere('assets.preventiveMaintenance = :pmId', {
                pmId: pm.id,
              })
              .getOne();
            if (!isExistAsset) {
              await this.pmAssetsRepository.save(
                new PreventiveMaintenanceAssets({
                  asset: asset,
                  preventiveMaintenance: pm,
                }),
              );
            }
          }),
        );
      }
      const pmAsset = await this.masterPmAssetsRepository.save(
        new MasterPreventiveMaintenanceAssets({
          asset: asset,
          masterPreventiveMaintenance: isExist,
        }),
      );

      return {
        message: 'Asset added to master preventive maintenance',
        data: { asset: pmAsset },
      };
    } catch (error) {
      throw error;
    }
  }

  async createManyForMaster(masterPmId: string, assetIds: string[]) {
    return Promise.all(
      assetIds.map(
        async (assetId) =>
          await this.createForMaster(masterPmId, {
            assetId,
          }),
      ),
    );
  }

  async createAndRemove(pmId: string, assetIds: string[]) {
    try {
      const existingAssets = await this.pmAssetsRepository
        .createQueryBuilder('asset')
        .where('asset.preventiveMaintenance = :pmId', { pmId })
        .getRawMany();
      const existingAssetList = existingAssets.map((ast) => ast.asset_asset_id);
      const existingRemovingAssetList = existingAssetList.filter(
        (assetId) => !assetIds.includes(assetId),
      );
      if (existingRemovingAssetList.length) {
        this.pmAssetsRepository.delete({
          preventiveMaintenance: In([pmId]),
          asset: In(existingRemovingAssetList),
        });
      }
      const nonExistingAssets = assetIds.filter(
        (assetId) => !existingAssetList.includes(assetId),
      );

      if (nonExistingAssets.length > 0) {
        await this.insertMany([
          ...nonExistingAssets.map((asset) => ({
            asset: asset,
            preventiveMaintenance: pmId,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async createAndRemoveMaster(masterPmId: string, assetIds: string[]) {
    try {
      const existingAssets = await this.masterPmAssetsRepository
        .createQueryBuilder('asset')
        .where('asset.masterPreventiveMaintenance = :masterPmId', {
          masterPmId,
        })
        .getRawMany();
      const existingAssetsList = existingAssets.map(
        (ast) => ast.asset_asset_id,
      );
      const existingRemovingAssetsList = existingAssetsList.filter(
        (assetId) => !assetIds.includes(assetId),
      );
      if (existingRemovingAssetsList.length) {
        this.masterPmAssetsRepository.delete({
          masterPreventiveMaintenance: In([masterPmId]),
          asset: In(existingRemovingAssetsList),
        });
      }
      const nonExistingAssets = assetIds.filter(
        (assetId) => !existingAssetsList.includes(assetId),
      );
      if (nonExistingAssets.length > 0) {
        await this.insertManyMaster([
          ...nonExistingAssets.map((asset) => ({
            asset: asset,
            masterPreventiveMaintenance: masterPmId,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(
    pmId: string,
    assetId: string,
  ): Promise<CreatePreventiveMaintenanceAssetResponseDto> {
    try {
      const isExist = await this.pmAssetsRepository.findOneBy({
        asset: { id: assetId },
        preventiveMaintenance: { id: pmId },
      });
      if (!isExist) {
        throw new NotFoundException(
          'Preventive maintenance asset does not exist',
        );
      }
      const asset = await this.pmAssetsRepository.remove(isExist);

      return {
        message: 'Asset remove to preventive maintenance',
        data: { asset },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(pmIds: string[]): Promise<BaseResponseDto> {
    try {
      await this.pmAssetsRepository.delete({
        preventiveMaintenance: In(pmIds),
      });
      return {
        message: 'Assets delete to preventive maintenance',
      };
    } catch (error) {
      throw error;
    }
  }

  async removeForMaster(
    masterPmId: string,
    assetId: string,
  ): Promise<CreatePreventiveMaintenanceAssetResponseDto> {
    try {
      const [isExistForMaster, findCurrentPM, findCurrentPMs] =
        await Promise.all([
          this.masterPmAssetsRepository.findOneBy({
            asset: { id: assetId },
            masterPreventiveMaintenance: { id: masterPmId },
          }),
          this.pmService.findOneByMasterPmId(masterPmId),
          this.pmService.findFutureAndCurrentPMs(masterPmId),
        ]);
      const isExist = await this.pmAssetsRepository.findOneBy({
        asset: { id: assetId },
        preventiveMaintenance: { id: findCurrentPM.id },
      });
      if (!isExistForMaster) {
        throw new NotFoundException(
          'Preventive maintenance asset does not exist',
        );
      }
      if (isExist) {
        await this.pmAssetsRepository.delete({
          preventiveMaintenance: In(findCurrentPMs.map((pm) => pm.id)),
          asset: In([assetId]),
        });
      }
      const asset = await this.masterPmAssetsRepository.remove(
        isExistForMaster,
      );

      return {
        message: 'Asset remove to master preventive maintenance',
        data: { asset },
      };
    } catch (error) {
      throw error;
    }
  }

  async insertMany(pmAsset) {
    try {
      return await this.pmAssetsRepository.insert(pmAsset);
    } catch (error) {
      throw error;
    }
  }

  async insertManyMaster(masterPmAsset) {
    try {
      return await this.masterPmAssetsRepository.insert(masterPmAsset);
    } catch (error) {
      throw error;
    }
  }
}
