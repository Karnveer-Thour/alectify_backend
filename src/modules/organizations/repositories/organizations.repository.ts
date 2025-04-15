import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class OrganizationsRepository extends BaseRepository<Organization> {
  constructor(private dataSource: DataSource) {
    super(Organization, dataSource);
  }
}
