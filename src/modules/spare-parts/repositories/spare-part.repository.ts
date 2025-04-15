import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { SparePart } from '../entities/spare-part.entity';

@Injectable()
export class SparePartRepository extends BaseRepository<SparePart> {
  constructor(private dataSource: DataSource) {
    super(SparePart, dataSource);
  }

  async findAndCreate(sparePart: SparePart): Promise<SparePart> {
    const findOne = await this.findOneBy({
      partNumber: sparePart.partNumber,
    });
    if (findOne) {
      return findOne;
    }
    return await this.save(sparePart);
  }
}
