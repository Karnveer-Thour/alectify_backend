import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { MasterPreventiveMaintenanceImages } from '../entities/master-preventive-maintenance-images.entity';

@Injectable()
export class MasterPreventiveMaintenanceImagesRepository extends BaseRepository<MasterPreventiveMaintenanceImages> {
  constructor(private dataSource: DataSource) {
    super(MasterPreventiveMaintenanceImages, dataSource);
  }
}
