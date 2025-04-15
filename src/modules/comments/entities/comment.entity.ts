import { PreventiveMaintenances } from 'modules/preventive-maintenances/entities/preventive-maintenances.entity';
import { SubProject } from 'modules/projects/entities/sub-project.entity';
import { User } from 'modules/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('comments')
// @Index('comments_pkey', ['id'], { unique: true })
@Index('comments_project_898184_idx', ['subProject', 'referenceId'], {})
@Index('comments_project_id_703f8155', ['subProject'], {})
@Index('comments_reference_id_dc64d348', ['referenceId'], {})
@Index('comments_reference_id_dc64d348_like', ['referenceId'], {})
@Index('comments_sent_by_id_e11fa718', ['sentBy'], {})
export class Comment {
  @Column({ primary: true, name: 'id', type: 'uuid' })
  id: string;

  @ManyToOne(() => PreventiveMaintenances, (pm) => pm.comments, {
    nullable: false,
  })
  @JoinColumn([{ name: 'reference_id', referencedColumnName: 'id' }])
  // @Column({ name: 'reference_id', type: 'text' })
  referenceId: string;

  @Column({ name: 'text', nullable: true, type: 'text' })
  text: string | null;

  @Column({ name: 'content_type', type: 'text' })
  contentType: string;

  @Column({ name: 's3_key', nullable: true, type: 'text' })
  s3Key: string | null;

  @Column({ name: 'file_name', nullable: true, type: 'text' })
  fileName: string | null;

  @Column({ name: 'is_active', type: 'int4' })
  isActive: number;

  @Column({ name: 'reference_type', type: 'text' })
  referenceType: string;

  @ManyToOne(() => SubProject, (subProject) => subProject.comment, {
    nullable: false,
  })
  @JoinColumn([{ name: 'project_id', referencedColumnName: 'id' }])
  subProject: SubProject;

  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
  })
  @JoinColumn([{ name: 'sent_by_id', referencedColumnName: 'id' }])
  sentBy: User;

  @Column({
    name: 'is_system_generated',
    type: 'bool',
    default: false,
  })
  isSystemGenerated: boolean;

  @Column({ name: 'speech_transcript', type: 'text', nullable: true })
  speechTranscript: string;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  constructor(entity: Partial<Comment>) {
    Object.assign(this, entity);
  }
}
