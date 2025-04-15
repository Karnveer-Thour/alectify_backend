import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Branch } from './branch.entity';

@Entity('features')
@Index('features_branch_id_503d2a81', ['branch'], {})
// @Index('features_pkey', ['id'], { unique: true })
export class Feature {
  @Column({ primary: true, name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'project_documents', type: 'boolean' })
  projectDocuments: boolean;

  @Column({ name: 'equipment_documents', type: 'boolean' })
  equipmentDocuments: boolean;

  @Column({ name: 'create_project', type: 'boolean' })
  createProject: boolean;

  @Column({ name: 'manage_project', type: 'boolean' })
  manageProject: boolean;

  @Column({ name: 'master_tags', type: 'boolean' })
  masterTags: boolean;

  @Column({ name: 'notifications', type: 'boolean' })
  notifications: boolean;

  @Column({ name: 'review_process', type: 'boolean' })
  reviewProcess: boolean;

  @Column({ name: 'is_active', type: 'int', nullable: true })
  isActive: number | null;

  @Column({ name: 'my_calendar', type: 'boolean' })
  myCalendar: boolean;

  @Column({ name: 'my_items', type: 'boolean' })
  myItems: boolean;

  @Column({ name: 'spareparts', type: 'boolean' })
  spareparts: boolean;

  @ManyToOne(() => Branch, (branch) => branch.features)
  @JoinColumn([{ name: 'branch_id', referencedColumnName: 'id' }])
  branch: Branch;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
