import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from 'modules/users/entities/user.entity';
import { ILike } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationTypesRepository } from './repositories/organization-types.repository';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { dateToUTC } from '@common/utils/utils';

@Injectable()
export class OrganizationsService {
  constructor(
    private organizationsRepository: OrganizationsRepository,
    private organizationTypesRepository: OrganizationTypesRepository,
  ) {}

  async findOneById(id: string) {
    try {
      return this.organizationsRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw error;
    }
  }
  async findOneByNameOrCreate(name: string) {
    try {
      let findOneOrCreate = await this.organizationsRepository.findOneBy({
        name: ILike(`%${name}%`),
      });
      if (!findOneOrCreate) {
        const orgTypes = await this.organizationTypesRepository.findOneBy({
          name: 'Contractor',
        });
        findOneOrCreate = await this.organizationsRepository.save(
          new Organization({
            id: randomUUID(),
            name: name,
            isActive: 1,
            organizationType: orgTypes,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          }),
        );
      }
      return findOneOrCreate;
    } catch (error) {
      throw error;
    }
  }

  async findOneByName(name: string) {
    try {
      return this.organizationsRepository.findOneBy({
        name: ILike(`%${name}%`),
      });
    } catch (error) {
      throw error;
    }
  }

  async findBySpareParts(
    user: User,
    projectId = null,
  ): Promise<Organization[]> {
    try {
      const query = this.organizationsRepository
        .createQueryBuilder('o')
        .leftJoin('o.projectSpareParts', 'projectSpareParts')
        .leftJoin('projectSpareParts.project', 'project')
        .where('project.branch =:branchId', {
          branchId: user.branch.id,
        });

      if (projectId) {
        query.andWhere('project.id = :projectId', { projectId });
      }

      return query.getMany();
    } catch (error) {
      throw error;
    }
  }
}
