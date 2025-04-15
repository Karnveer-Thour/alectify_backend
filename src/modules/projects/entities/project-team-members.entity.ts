import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectTeams } from './project-teams.entity';

@Index(
  'projects_masterprojectteam_masterprojectteam_id_50db8acc',
  ['projectTeam'],
  {},
)
@Index(
  'projects_masterprojectte_masterprojectteam_id_use_b76438fb_uniq',
  ['projectTeam', 'user'],
  { unique: true },
)
@Index('projects_masterprojectteam_team_members_user_id_3c7482b0', ['user'], {})
@Entity('projects_masterprojectteam_team_members', { schema: 'public' })
export class ProjectTeamMembers {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @ManyToOne(() => ProjectTeams, (pt) => pt.projectTeamMembers)
  @JoinColumn([{ name: 'masterprojectteam_id', referencedColumnName: 'id' }])
  projectTeam: ProjectTeams;

  @ManyToOne(() => User, (user) => user.projectTeamMembers)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  constructor(entity: Partial<ProjectTeamMembers>) {
    Object.assign(this, entity);
  }
}
