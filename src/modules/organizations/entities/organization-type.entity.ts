import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from './organization.entity';
import { Role } from '../../users/entities/role.entity';
import { Permission } from '../../users/entities/permission.entity';

@Entity('organization_types')
// @Index('organization_types_pkey', ['id'], { unique: true })
@Index('organization_types_name_3abbf33e', ['name'], {})
@Index('organization_types_name_3abbf33e_like', ['name'], {})
export class OrganizationType {
  @Column({ primary: true, name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'is_active', type: 'int', nullable: true })
  isActive: number;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy: number;

  @OneToMany(
    () => Organization,
    (organization) => organization.organizationType,
  )
  organizations: Organization[];

  @OneToMany(() => Permission, (permission) => permission.organizationType)
  permissions: Permission[];

  @OneToMany(() => Role, (role) => role.organizationType)
  roles: Role[];

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  constructor(entity: Partial<Organization>) {
    Object.assign(this, entity);
  }
}
