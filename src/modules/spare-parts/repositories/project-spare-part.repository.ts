import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { ProjectSparePart } from '../entities/project-spare-part.entity';

@Injectable()
export class ProjectSparePartRepository extends BaseRepository<ProjectSparePart> {
  constructor(private dataSource: DataSource) {
    super(ProjectSparePart, dataSource);
  }

  async findById(id: string): Promise<ProjectSparePart> {
    return await this.createQueryBuilder('psp')
      .leftJoinAndSelect('psp.project', 'project')
      .leftJoinAndSelect('psp.preferredSupplier', 'preferredSupplier')
      .where('psp.id = :id', {
        id,
      })
      .leftJoinAndSelect('psp.sparePart', 'sparePart')
      .getOne();
  }
}
