import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from './project.entity';

@Index('master_projects_account_masterproject_id_c3aefe35', ['project'], {})
@Index(
  'master_projects_account_masterproject_id_user_id_f3f7d179_uniq',
  ['project', 'user'],
  { unique: true },
)
@Index('master_projects_account_user_id_9dc0f5db', ['user'], {})
@Entity('master_projects_account')
export class ProjectAccount {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @ManyToOne(() => Project, (project) => project.projectsAccounts)
  @JoinColumn([{ name: 'masterproject_id', referencedColumnName: 'id' }])
  project: Project;

  @ManyToOne(() => User, (user) => user.projectsAccounts)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  constructor(entity: Partial<ProjectAccount>) {
    Object.assign(this, entity);
  }
}
