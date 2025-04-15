import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ManageOrder } from '../entities/manage-order.entity';

@Injectable()
export class ManageOrdersRepository extends BaseRepository<ManageOrder> {
  constructor(private dataSource: DataSource) {
    super(ManageOrder, dataSource);
  }

  async findLastRecord(
    projectId: string,
    projectSparePartId: string,
  ): Promise<ManageOrder> {
    try {
      return this.createQueryBuilder('mo')
        .leftJoinAndSelect('mo.project', 'project')
        .where('project.id = :projectId', { projectId })
        .andWhere('project_spare_part_id = :projectSparePartId', {
          projectSparePartId,
        })
        .orderBy('mo.created_at', 'DESC')
        .getOne();
    } catch (error) {
      throw error;
    }
  }
}
