import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { SubProject } from '../../projects/entities/sub-project.entity';
import { Company } from './company.entity';
import { Feature } from './feature.entity';
import { User } from '../../users/entities/user.entity';
import { ProceduresLibrary } from 'modules/procedures/entities/procedures-library-entity';

@Entity('branches')
@Index('branches_company_id_c17fd5ca', ['company'], {})
// @Index('branches_pkey', ['id'], { unique: true })
export class Branch {
  @Column({ primary: true, name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'name', type: 'varchar', nullable: true, length: 255 })
  name: string | null;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  description: string | null;

  @ManyToOne(() => Company, (company) => company.branch)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  company: Company;

  @OneToMany(() => Feature, (feature) => feature.branch)
  features: Feature[];

  @OneToMany(() => Project, (project) => project.branch)
  masterProjects: Project[];

  @OneToMany(() => SubProject, (subProject) => subProject.branch)
  projects: SubProject[];

  @OneToMany(() => User, (user) => user.branch)
  users: User[];

  @OneToMany(
    () => ProceduresLibrary,
    (prodecureLibrary) => prodecureLibrary.branch,
  )
  procedureLibraries: ProceduresLibrary[];

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
