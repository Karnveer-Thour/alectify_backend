import { BaseEntity } from '@common/entities/base.entity';
import { IsDateString, IsOptional } from 'class-validator';
import { Organization } from 'modules/organizations/entities/organization.entity';
import { Project } from 'modules/projects/entities/project.entity';
import { User } from 'modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contractManagement')
@Index([
  'site',
  'vendor',
  'description',
  'contractNumber',
  'contractAmount',
  'comments',
  'startDate',
  'endDate',
  'autoRenew',
  'contact',
  'attachment',
])
export class contractManagement extends BaseEntity<Document> {
  @ManyToOne(() => Project, (pro) => pro.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Organization, (Organization) => Organization.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({
    name: 'contractNumber',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  contractNumber: string;

  @Column({ name: 'contractAmount', type: 'float' })
  contractAmount: number;

  @Column({ name: 'comments', type: 'varchar', length: 255 })
  comments: string;

  @Column({ name: 'startDate', type: 'timestamp with time zone' })
  @IsDateString()
  startDate: Date;

  @Column({ name: 'endDate', type: 'timestamp with time zone' })
  @IsDateString()
  endDate: Date;

  @Column({ name: 'autoRenew', type: 'bool', default: false })
  autoRenew: boolean;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'attachments', type: 'array', nullable: true })
  attachments: string[];

  @CreateDateColumn({ name: 'createdAt', type: 'date' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'date' })
  updatedAt?: Date;
}
