import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ProceduresLibrary } from './procedures-library-entity';

@Entity('procedure_categories')
export class ProcedureCategories extends BaseEntity<ProcedureCategories> {
  @Column({ name: 'name', type: 'varchar', nullable: true })
  name: string;

  @OneToMany(() => ProceduresLibrary, (pm) => pm.procedureCategory)
  procedureLibrary: ProceduresLibrary;

  constructor(entity: Partial<ProcedureCategories>) {
    super(entity);
    Object.assign(this, entity);
  }
}
