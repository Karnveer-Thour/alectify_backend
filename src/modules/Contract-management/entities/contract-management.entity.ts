import { BaseEntity } from '@common/entities/base.entity';
import { Organization } from 'modules/organizations/entities/organization.entity';
import { Project } from 'modules/projects/entities/project.entity';
import { User } from 'modules/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ContractManagementDocument } from './contract-management-document.entity';

@Entity('contract_management')
@Index(['project', 'organization', 'contactUser'])
export class ContractManagement extends BaseEntity<ContractManagement> {
  @ManyToOne(() => Project, (pro) => pro.id, { nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Organization, (Organization) => Organization.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'preferred_supplier_id' })
  organization: Organization;

  @Column({ name: 'description', type: 'varchar', nullable: true, length: 255 })
  description: string;

  @Column({
    name: 'contract_number',
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  contractNumber: string;

  @Column({
    name: 'contract_amount',
    type: 'float',
    nullable: false,
    default: 0,
  })
  contractAmount: number;

  @Column({ name: 'comments', type: 'varchar', nullable: true, length: 255 })
  comments: string;

  @Column({
    name: 'start_date',
    type: 'timestamp with time zone',
    nullable: false,
  })
  startDate: Date;

  @Column({
    name: 'endDate',
    type: 'timestamp with time zone',
    nullable: false,
  })
  endDate: Date;

  @Column({
    name: 'is_recurring',
    type: 'bool',
    nullable: false,
    default: false,
  })
  isRecurring: boolean;

  @Column({
    name: 'soft_deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  softDeletedAt: Date;

  @Column({ name: 'is_active', type: 'bool', nullable: false, default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'contact_user_id' })
  contactUser: User;

  //Inverse relation
  @OneToMany(
    () => ContractManagementDocument,
    (irDocument) => irDocument.contractManagement,
  )
  documents: ContractManagementDocument[];

  // constructor
  constructor(entity: Partial<ContractManagement>) {
    super(entity);
    Object.assign(this, entity);
  }
}
