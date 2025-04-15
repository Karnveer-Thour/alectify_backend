import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrganizationType } from './organization-type.entity';
import { Role } from '../../users/entities/role.entity';
import { Asset } from '../../assets/entities/asset.entity';
import { ProjectSparePart } from 'modules/spare-parts/entities/project-spare-part.entity';

@Entity('organizations')
// @Index('organizations_pkey', ['id'], { unique: true })
@Index('organizatio_name_bae373_idx', ['isActive', 'name'], {})
@Index('organizations_org_type_id_94b17afc', ['organizationType'], {})
export class Organization {
  @Column({ primary: true, name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255 }) name: string;

  @Column({ name: 'is_active', type: 'int', nullable: true })
  isActive: number | null;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy: number | null;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @ManyToOne(
    () => OrganizationType,
    (organizationTypes) => organizationTypes.organizations,
  )
  @JoinColumn([{ name: 'org_type_id', referencedColumnName: 'id' }])
  organizationType: OrganizationType;

  @OneToMany(() => Role, (roles) => roles.organizationType)
  roles: Role[];

  @OneToMany(() => Asset, (asset) => asset.manufacture)
  assetManufactures: Asset[];

  @OneToMany(() => Asset, (asset) => asset.preferredSupplier)
  assetPreferredSuppliers: Asset[];

  @OneToMany(() => ProjectSparePart, (psp) => psp.preferredSupplier)
  projectSpareParts: ProjectSparePart[];

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  constructor(entity: Partial<Organization>) {
    Object.assign(this, entity);
  }
}
