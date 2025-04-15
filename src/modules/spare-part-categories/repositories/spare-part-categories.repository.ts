import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { SparePartCategory } from '../entities/spare-part-category.entity';
import { CreateSparePartCategoryDto } from '../dto/create-spare-part-category.dto';
import { ProjectSparePartCategory } from '../entities/project-spare-part-category.entity';

@Injectable()
export class SparePartCategoryRepository extends BaseRepository<SparePartCategory> {
  constructor(private dataSource: DataSource) {
    super(SparePartCategory, dataSource);
  }

  async findAndCreate(
    createSparePartCategoryDto: CreateSparePartCategoryDto,
  ): Promise<SparePartCategory> {
    const findOne = await this.findOneBy({
      category: createSparePartCategoryDto.category,
    });
    if (findOne) {
      return findOne;
    }
    return await this.save(new SparePartCategory(createSparePartCategoryDto));
  }
}
