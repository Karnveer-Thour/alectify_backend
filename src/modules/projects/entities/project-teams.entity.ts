import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { ProjectTeamMembers } from './project-team-members.entity';

@Index('projects_masterprojectteam_master_project_id_2d933b3e', ['project'], {})
@Entity('projects_masterprojectteam', { schema: 'public' })
export class ProjectTeams {
  @Column('timestamp with time zone', { name: 'created_at' })
  createdAt: Date;

  @Column('timestamp with time zone', { name: 'updated_at' })
  updatedAt: Date;

  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('character varying', {
    name: 'description',
    length: 255,
  })
  description: string;

  @Column('boolean', { name: 'is_active', nullable: true })
  isActive: boolean | null;

  @ManyToOne(() => Project, (project) => project.projectTeams)
  @JoinColumn([{ name: 'master_project_id', referencedColumnName: 'id' }])
  project: Project;

  @OneToMany(() => ProjectTeamMembers, (ptm) => ptm.projectTeam)
  projectTeamMembers: ProjectTeamMembers[];

  constructor(entity: Partial<ProjectTeams>) {
    Object.assign(this, entity);
  }
}
