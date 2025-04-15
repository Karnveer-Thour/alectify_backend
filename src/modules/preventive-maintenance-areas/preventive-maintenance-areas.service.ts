import { BaseResponseDto } from '@common/dto/base-response.dto';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AreasService } from 'modules/areas/areas.service';
import { MasterPreventiveMaintenances } from 'modules/preventive-maintenances/entities/master-preventive-maintenances.entity';
import { PreventiveMaintenances } from 'modules/preventive-maintenances/entities/preventive-maintenances.entity';
import { In } from 'typeorm';
import { PreventiveMaintenancesService } from '../preventive-maintenances/preventive-maintenances.service';
import { CreatePreventiveMaintenanceAreaResponseDto } from './dto/create-preventive-maintenance-area-response.dto';
import { CreatePreventiveMaintenanceAreaDto } from './dto/create-preventive-maintenance-area.dto';
import { MasterPreventiveMaintenanceAreas } from './entities/master-preventive-maintenance-areas.entity';
import { PreventiveMaintenanceAreas } from './entities/preventive-maintenance-areas.entity';
import { MasterPreventiveMaintenanceAreasRepository } from './repositories/master-preventive-maintenance-areas.repository';
import { PreventiveMaintenanceAreasRepository } from './repositories/preventive-maintenance-areas.repository';
import { dateToUTC } from '@common/utils/utils';

@Injectable()
export class PreventiveMaintenanceAreasService {
  constructor(
    private pmAreasRepository: PreventiveMaintenanceAreasRepository,
    private masterPmAreasRepository: MasterPreventiveMaintenanceAreasRepository,
    @Inject(forwardRef(() => PreventiveMaintenancesService))
    private pmService: PreventiveMaintenancesService,
    private areasService: AreasService,
  ) {}

  async findAreasByPMId(pm: PreventiveMaintenances) {
    return await this.pmAreasRepository
      .createQueryBuilder('areas')
      .where('areas.preventiveMaintenance = :pmId', { pmId: pm.id })
      .leftJoinAndSelect('areas.area', 'area')
      .getMany();
  }

  async findAreasByMasterPMId(pm: MasterPreventiveMaintenances) {
    return await this.masterPmAreasRepository
      .createQueryBuilder('areas')
      .where('areas.masterPreventiveMaintenance = :pmId', { pmId: pm.id })
      .leftJoinAndSelect('areas.area', 'area')
      .getMany();
  }

  async create(
    pmId: string,
    createPMAreaDto: CreatePreventiveMaintenanceAreaDto,
  ): Promise<CreatePreventiveMaintenanceAreaResponseDto> {
    try {
      const isExist = await this.pmService.findOneByIdWithoutRelations(pmId);
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      const area = await this.areasService.findOneById(createPMAreaDto.areaId);
      const isExistArea = await this.pmAreasRepository
        .createQueryBuilder('areas')
        .where('areas.area = :areaId', { areaId: area.id })
        .andWhere('areas.preventiveMaintenance = :pmId', { pmId })
        .getOne();

      if (isExistArea) {
        throw new BadRequestException('Area already exist');
      }
      const pmArea = await this.pmAreasRepository.save(
        new PreventiveMaintenanceAreas({
          area: area,
          preventiveMaintenance: isExist,
        }),
      );

      return {
        message: 'Area added to preventive maintenance',
        data: { area: pmArea },
      };
    } catch (error) {
      throw error;
    }
  }

  async createMany(pmId: string, areaIds: string[]) {
    return Promise.all(
      areaIds.map(
        async (areaId) =>
          await this.create(pmId, {
            areaId,
          }),
      ),
    );
  }

  async createAndRemove(pmId: string, areaIds: string[]) {
    try {
      const existingAreas = await this.pmAreasRepository
        .createQueryBuilder('area')
        .where('area.preventiveMaintenance = :pmId', { pmId })
        .getRawMany();
      const existingAreaList = existingAreas.map((area) => area.area_area_id);
      const existingRemovingAreaList = existingAreaList.filter(
        (areaId) => !areaIds.includes(areaId),
      );
      if (existingRemovingAreaList.length) {
        this.pmAreasRepository.delete({
          preventiveMaintenance: In([pmId]),
          area: In(existingRemovingAreaList),
        });
      }
      const nonExistingAreas = areaIds.filter(
        (areaId) => !existingAreaList.includes(areaId),
      );

      if (nonExistingAreas.length > 0) {
        await this.insertMany([
          ...nonExistingAreas.map((area) => ({
            area: area,
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

  async createAndRemoveMaster(masterPmId: string, areaIds: string[]) {
    try {
      const existingAreas = await this.masterPmAreasRepository
        .createQueryBuilder('area')
        .where('area.masterPreventiveMaintenance = :masterPmId', {
          masterPmId,
        })
        .getRawMany();
      const existingAreasList = existingAreas.map((ast) => ast.area_area_id);
      const existingRemovingAreasList = existingAreasList.filter(
        (areaId) => !areaIds.includes(areaId),
      );
      if (existingRemovingAreasList.length) {
        this.masterPmAreasRepository.delete({
          masterPreventiveMaintenance: In([masterPmId]),
          area: In(existingRemovingAreasList),
        });
      }
      const nonExistingAreas = areaIds.filter(
        (areaId) => !existingAreasList.includes(areaId),
      );
      if (nonExistingAreas.length > 0) {
        await this.insertManyMaster([
          ...nonExistingAreas.map((area) => ({
            area: area,
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

  async createForMaster(
    masterPmId: string,
    createPMAreaDto: CreatePreventiveMaintenanceAreaDto,
  ): Promise<CreatePreventiveMaintenanceAreaResponseDto> {
    try {
      const [isExist, findCurrentPMs] = await Promise.all([
        this.pmService.masterFindOneById(masterPmId),
        this.pmService.findFutureAndCurrentPMs(masterPmId),
      ]);
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      const area = await this.areasService.findOneById(createPMAreaDto.areaId);
      const isExistAreaForMaster = await this.masterPmAreasRepository
        .createQueryBuilder('areas')
        .where('areas.area = :areaId', { areaId: area.id })
        .andWhere('areas.masterPreventiveMaintenance = :masterPmId', {
          masterPmId,
        })
        .getOne();
      if (isExistAreaForMaster) {
        throw new BadRequestException('Area already exist');
      }
      if (findCurrentPMs.length) {
        await Promise.all(
          findCurrentPMs.map(async (pm) => {
            const isExistArea = await this.pmAreasRepository
              .createQueryBuilder('areas')
              .where('areas.area = :areaId', { areaId: area.id })
              .andWhere('areas.preventiveMaintenance = :pmId', {
                pmId: pm.id,
              })
              .getOne();
            if (!isExistArea) {
              await this.pmAreasRepository.save(
                new PreventiveMaintenanceAreas({
                  area: area,
                  preventiveMaintenance: pm,
                }),
              );
            }
          }),
        );
      }
      const pmArea = await this.masterPmAreasRepository.save(
        new MasterPreventiveMaintenanceAreas({
          area: area,
          masterPreventiveMaintenance: isExist,
        }),
      );

      return {
        message: 'Area added to master preventive maintenance',
        data: { area: pmArea },
      };
    } catch (error) {
      throw error;
    }
  }

  async createManyForMaster(masterPmId: string, areaIds: string[]) {
    return Promise.all(
      areaIds.map(
        async (areaId) =>
          await this.createForMaster(masterPmId, {
            areaId,
          }),
      ),
    );
  }

  async remove(
    pmId: string,
    areaId: string,
  ): Promise<CreatePreventiveMaintenanceAreaResponseDto> {
    try {
      const isExist = await this.pmAreasRepository.findOneBy({
        area: { id: areaId },
        preventiveMaintenance: { id: pmId },
      });
      if (!isExist) {
        throw new NotFoundException(
          'Preventive maintenance area does not exist',
        );
      }
      const area = await this.pmAreasRepository.remove(isExist);

      return {
        message: 'Area remove to preventive maintenance',
        data: { area },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(pmIds: string[]): Promise<BaseResponseDto> {
    try {
      await this.pmAreasRepository.delete({
        preventiveMaintenance: In(pmIds),
      });
      return {
        message: 'Areas delete to preventive maintenance',
      };
    } catch (error) {
      throw error;
    }
  }

  async removeForMaster(
    masterPmId: string,
    areaId: string,
  ): Promise<CreatePreventiveMaintenanceAreaResponseDto> {
    try {
      const [isExistForMaster, findCurrentPM, findCurrentPMs] =
        await Promise.all([
          this.masterPmAreasRepository.findOneBy({
            area: { id: areaId },
            masterPreventiveMaintenance: { id: masterPmId },
          }),
          this.pmService.findOneByMasterPmId(masterPmId),
          this.pmService.findFutureAndCurrentPMs(masterPmId),
        ]);
      const isExist = await this.pmAreasRepository.findOneBy({
        area: { id: areaId },
        preventiveMaintenance: { id: findCurrentPM.id },
      });
      if (!isExistForMaster) {
        throw new NotFoundException(
          'Preventive maintenance area does not exist',
        );
      }
      if (isExist) {
        await this.pmAreasRepository.delete({
          preventiveMaintenance: In(findCurrentPMs.map((pm) => pm.id)),
          area: In([areaId]),
        });
      }
      const area = await this.masterPmAreasRepository.remove(isExistForMaster);
      return {
        message: 'Area remove to master preventive maintenance',
        data: { area },
      };
    } catch (error) {
      throw error;
    }
  }

  async insertMany(pmAreas) {
    try {
      return await this.pmAreasRepository.insert(pmAreas);
    } catch (error) {
      throw error;
    }
  }

  async insertManyMaster(masterPmAreas) {
    try {
      return await this.masterPmAreasRepository.insert(masterPmAreas);
    } catch (error) {
      throw error;
    }
  }
}
