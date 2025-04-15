import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ManageOrderView } from '../entities/ manage-order-view.entity';

@Injectable()
export class ManageOrdersViewRepository extends BaseRepository<ManageOrderView> {
  constructor(private dataSource: DataSource) {
    super(ManageOrderView, dataSource);
  }
}
