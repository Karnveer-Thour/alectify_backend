import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, Index } from 'typeorm';
import { ApplicationTypes } from '../models/application-types.enum';

@Entity('application_versions')
@Index(['applicationType'])
export class ApplicationVersion extends BaseEntity<ApplicationVersion> {
  @Column({ name: 'version', type: 'varchar', nullable: false })
  version: string;

  @Column({
    name: 'is_force_update',
    type: 'bool',
    default: false,
    nullable: false,
  })
  isForceUpdate: boolean;

  @Column({
    name: 'application_type',
    type: 'enum',
    enum: ApplicationTypes,
    nullable: false,
  })
  applicationType: ApplicationTypes;

  constructor(entity: Partial<ApplicationVersion>) {
    super(entity);
    Object.assign(this, entity);
  }
}
