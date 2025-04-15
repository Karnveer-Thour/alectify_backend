import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrganizationType } from '../../organizations/entities/organization-type.entity';
import { Permission } from './permission.entity';

@Entity('roles')
// @Index('roles_pkey', ['id'], { unique: true })
@Index('roles_org_type_id_18e87678', ['organizationType'], {})
export class Role {
  @Column({ primary: true, name: 'id', type: 'uuid' })
  id: string;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('integer', { name: 'is_active', nullable: true })
  isActive: number | null;

  @Column('integer', { name: 'created_by', nullable: true })
  createdBy: number | null;

  @OneToMany(() => Permission, (permission) => permission.role)
  permissions: Permission[];

  @ManyToOne(
    () => OrganizationType,
    (organizationType) => organizationType.roles,
  )
  @JoinColumn([{ name: 'org_type_id', referencedColumnName: 'id' }])
  organizationType: OrganizationType;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
