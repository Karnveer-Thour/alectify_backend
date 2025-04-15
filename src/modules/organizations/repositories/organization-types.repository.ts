import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrganizationType } from '../entities/organization-type.entity';

@Injectable()
export class OrganizationTypesRepository extends BaseRepository<OrganizationType> {
  constructor(private dataSource: DataSource) {
    super(OrganizationType, dataSource);
  }
}
