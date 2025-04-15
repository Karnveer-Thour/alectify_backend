import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { GetAllServicesResponseDto } from './dto/get-all-services-response.dto';
import { ServiceStatuses } from './models/service-statuses.enum';
import { ServicesRepository } from './repositories/services.repository';
import { Area } from 'modules/areas/entities/area.entity';
import * as moment from 'moment';
import { ProceduresService } from 'modules/procedures/procedures.service';
import { ProjectsService } from 'modules/projects/projects.service';
import { Statuses } from 'modules/preventive-maintenances/models/status.enum';
import { User } from 'modules/users/entities/user.entity';

@Injectable()
export class ServicesService {
  constructor(
    private serviceRepository: ServicesRepository,
    private proceduresService: ProceduresService,
    private projectsService: ProjectsService,
  ) {}

  async findServiceByScheduledDateAndStatus(
    startDate: string,
    endDate: string,
    status: ServiceStatuses[],
  ): Promise<GetAllServicesResponseDto> {
    try {
      const services = this.serviceRepository
        .createQueryBuilder('service')
        .leftJoinAndSelect('service.subProject', 'subProject')
        .leftJoinAndSelect('subProject.project', 'project')
        .leftJoinAndSelect('service.area', 'area')
        .leftJoinAndSelect('service.asset', 'asset')
        .leftJoinAndMapMany(
          'asset.area',
          Area,
          'package_rooms',
          `package_rooms."id"::text = asset.packageroom_id::text`,
        )
        .andWhere('service.scheduledAt >=:startDate', {
          startDate: `${startDate} 00:00:00`,
        })
        .andWhere('service.scheduledAt <=:endDate', {
          endDate: `${endDate} 24:00:00`,
        });
      if (status) {
        services.andWhere('service.status IN (:...status)', {
          status,
        });
      }

      return {
        message: 'Get all services successfully',
        data: await services.orderBy('service.scheduledAt', 'DESC').getMany(),
      };
    } catch (error) {
      throw error;
    }
  }

  async findServicesMissedScheduledDate(
    date: string,
    status: ServiceStatuses[],
  ): Promise<GetAllServicesResponseDto> {
    try {
      const services = this.serviceRepository
        .createQueryBuilder('service')
        .leftJoinAndSelect('service.subProject', 'subProject')
        .leftJoinAndSelect('subProject.project', 'project')
        .leftJoinAndSelect('service.area', 'area')
        .leftJoinAndSelect('service.asset', 'asset')
        .leftJoinAndMapMany(
          'asset.area',
          Area,
          'package_rooms',
          `package_rooms."id"::text = asset.packageroom_id::text`,
        )
        .where('service.scheduledAt <=:date', {
          date: `${date} 24:00:00`,
        });
      if (status) {
        services.andWhere('service.status IN (:...status)', {
          status,
        });
      }

      return {
        message: 'Get all services successfully',
        data: await services.orderBy('service.scheduledAt', 'DESC').getMany(),
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string): Promise<any> {
    try {
      return await this.serviceRepository.findOne({
        where: { id },
        relations: [
          'procedure',
          'procedure.procedureSteps',
          'procedureLibrary',
        ],
      });
    } catch (error) {
      throw error;
    }
  }
}
