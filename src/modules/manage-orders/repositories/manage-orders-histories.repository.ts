import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ManageOrderHistory } from '../entities/manage-order-history.entity';

@Injectable()
export class ManageOrdersHistoriesRepository extends BaseRepository<ManageOrderHistory> {
  constructor(private dataSource: DataSource) {
    super(ManageOrderHistory, dataSource);
  }
}
