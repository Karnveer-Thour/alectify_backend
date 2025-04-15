import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationVersionResponseDto } from './dto/create-application-version-response.dto';
import { CreateApplicationVersionDto } from './dto/create-application-version.dto';
import { GetAllApplicationVersionsResponseDto } from './dto/get-all-application-versions-response.dto';
import { UpdateApplicationVersionDto } from './dto/update-application-version.dto';
import { ApplicationVersion } from './entities/application-version.entity';
import { ApplicationTypes } from './models/application-types.enum';
import { ApplicationVersionsRepository } from './repositories/application-versions.repository';
@Injectable()
export class ApplicationVersionsService {
  constructor(
    private applicationVersionsRepository: ApplicationVersionsRepository,
  ) {}
  async create(
    createApplicationVersionDto: CreateApplicationVersionDto,
  ): Promise<CreateApplicationVersionResponseDto> {
    try {
      return {
        message: 'Application version created successfully',
        data: await this.applicationVersionsRepository.save(
          new ApplicationVersion({
            ...createApplicationVersionDto,
          }),
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    token: string,
    applicationType: ApplicationTypes,
  ): Promise<GetAllApplicationVersionsResponseDto> {
    try {
      const applicationVersions =
        this.applicationVersionsRepository.createQueryBuilder('version');

      if (applicationType) {
        applicationVersions.where('version.applicationType =:applicationType', {
          applicationType,
        });
      }

      return {
        message: 'Get all application versions successfully',
        data: await applicationVersions.getMany(),
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<CreateApplicationVersionResponseDto> {
    try {
      return {
        message: 'Get application version successfully',
        data: await this.applicationVersionsRepository.findOneBy({
          id,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneByApplicationType(
    applicationType: ApplicationTypes,
  ): Promise<CreateApplicationVersionResponseDto> {
    try {
      return {
        message: 'Get application version successfully',
        data: await this.applicationVersionsRepository.findOneBy({
          applicationType,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateApplicationVersionDto: UpdateApplicationVersionDto,
  ): Promise<CreateApplicationVersionResponseDto> {
    try {
      const isExist = await this.applicationVersionsRepository.findOneBy({
        id,
      });

      if (!isExist) {
        throw new NotFoundException('Application version does not exist');
      }

      return {
        message: 'Application version updated successfully',
        data: await this.applicationVersionsRepository.save(
          new ApplicationVersion({
            ...isExist,
            ...updateApplicationVersionDto,
          }),
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
