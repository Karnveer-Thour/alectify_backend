import { BaseEntity } from '@common/entities/base.entity';
import { Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { ProjectSparePart } from '../../spare-parts/entities/project-spare-part.entity';
import { SparePartCategory } from './spare-part-category.entity';

@Entity('project_spare_part_categories')
@Index(['project', 'sparePartCategory'])
export class ProjectSparePartCategory extends BaseEntity<ProjectSparePartCategory> {
  @ManyToOne(() => Project, (pro) => pro.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => SparePartCategory, (cp) => cp.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'part_category_id' })
  sparePartCategory: SparePartCategory;

  @OneToMany(() => ProjectSparePart, (psp) => psp.projectSparePartCategory)
  projectSparePart: ProjectSparePart[];

  constructor(entity: Partial<ProjectSparePartCategory>) {
    super(entity);
    Object.assign(this, entity);
  }
}
