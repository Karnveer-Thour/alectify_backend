import { BaseEntity } from '@common/entities/base.entity';
import { S3 } from '@common/helpers/s3';
import { PreventiveMaintenances } from 'modules/preventive-maintenances/entities/preventive-maintenances.entity';
import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { JobType } from '../models/job-type.enum';
import { ProcedureSteps } from './procedure-steps-entity';
import { ProceduresLibrary } from './procedures-library-entity';
import { Project } from 'modules/projects/entities/project.entity';

const {
  env: {
    AWS_S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_REGION,
  },
} = process;

const s3 = new S3(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_REGION);
@Entity('procedures')
export class Procedures extends BaseEntity<Procedures> {
  @ManyToOne(() => Project, (pro) => pro.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({
    name: 'job_type',
    type: 'enum',
    enum: JobType,
    nullable: false,
  })
  jobType: JobType;

  @Column({ name: 'name', type: 'varchar', nullable: true })
  name: string;

  @Column({ name: 'reference', type: 'varchar', nullable: true })
  reference: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'comments', type: 'bool', nullable: false })
  comments: boolean;

  @Column({ name: 'file_upload', type: 'bool', nullable: false })
  fileUpload: boolean;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string;

  @OneToMany(
    () => ProcedureSteps,
    (masterprocedureStep) => masterprocedureStep.procedure,
    { cascade: ['insert', 'update', 'remove'] },
  )
  procedureSteps: ProcedureSteps[];

  @OneToOne(() => PreventiveMaintenances, (pm) => pm.procedure)
  preventiveMaintenance: PreventiveMaintenances;

  @ManyToOne(() => ProceduresLibrary, (procedure) => procedure.id)
  @JoinColumn({ name: 'procedure_library_id' })
  procedureLibrary: ProceduresLibrary;

  procedureStepTotalCount: number;

  procedureStepCheckedTotalCount: number;

  @AfterLoad()
  async populateSignedURLs() {
    if (this.imageUrl) {
      const signedUrl = await s3.privateSignedUrl(
        AWS_S3_BUCKET_NAME,
        this.imageUrl,
        604800,
      );
      this.imageUrl = signedUrl;
    } else {
      this.imageUrl = this.imageUrl;
    }
  }

  constructor(entity: Partial<Procedures>) {
    super(entity);
    Object.assign(this, entity);
  }
}
