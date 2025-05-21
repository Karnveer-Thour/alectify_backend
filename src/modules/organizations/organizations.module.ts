import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { OrganizationTypesRepository } from './repositories/organization-types.repository';

@Module({
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    OrganizationsRepository,
    OrganizationTypesRepository,
  ],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
