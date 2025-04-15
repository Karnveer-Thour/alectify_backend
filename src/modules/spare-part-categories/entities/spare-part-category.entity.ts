import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ProjectSparePartCategory } from './project-spare-part-category.entity';

@Entity('spare_part_categories')
@Index(['category'])
export class SparePartCategory extends BaseEntity<SparePartCategory> {
  @Column({
    name: 'category',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  category: string;

  @OneToMany(() => ProjectSparePartCategory, (ppc) => ppc.sparePartCategory)
  projectSparePartCategory: ProjectSparePartCategory[];

  constructor(entity: Partial<SparePartCategory>) {
    super(entity);
    Object.assign(this, entity);
  }
}
