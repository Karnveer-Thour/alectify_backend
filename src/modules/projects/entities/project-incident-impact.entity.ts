import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Project } from 'modules/projects/entities/project.entity';
import { IncidentReport } from 'modules/incident-reports/entities/incident-report.entity';

@Entity('incident_impacts')
@Index(['project', 'name'])
export class ProjectIncidentImpact extends BaseEntity<ProjectIncidentImpact> {
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => Project, (pro) => pro.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => IncidentReport, (ir) => ir.impact)
  incidentReports: IncidentReport[];

  constructor(entity: Partial<ProjectIncidentImpact>) {
    super(entity);
    Object.assign(this, entity);
  }
}
