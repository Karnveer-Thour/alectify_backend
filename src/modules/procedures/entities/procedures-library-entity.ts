import { BaseEntity } from '@common/entities/base.entity';
import { S3 } from '@common/helpers/s3';
import { Branch } from 'modules/users/entities/branch.entity';
import { User } from 'modules/users/entities/user.entity';
import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { JobType } from '../models/job-type.enum';
import { ProcedureCategories } from './procedure-category-entity';
import { ProcedureLibrarySteps } from './procedure-library-steps-entity';
import { Procedures } from './procedures-entity';
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
@Entity('procedures_library')
export class ProceduresLibrary extends BaseEntity<ProceduresLibrary> {
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

  @Column({ name: 'comments', type: 'boolean', default: false })
  comments: boolean;

  @Column({ name: 'file_upload', type: 'boolean', default: false })
  fileUpload: boolean;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string;

  @ManyToOne(() => Branch, (branch) => branch.procedureLibraries)
  @JoinColumn([{ name: 'branch_id', referencedColumnName: 'id' }])
  branch: Branch;

  @ManyToOne(() => User, (user) => user.procedureLibraries)
  @JoinColumn([{ name: 'created_by_id', referencedColumnName: 'id' }])
  createdBy: User;

  @ManyToOne(() => ProcedureCategories, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  procedureCategory: ProcedureCategories;

  @OneToMany(
    () => ProcedureLibrarySteps,
    (procedureStep) => procedureStep.procedureLibrary,
    { cascade: ['insert', 'update', 'remove'], eager: true },
  )
  procedureSteps: ProcedureLibrarySteps[];

  @OneToMany(() => Procedures, (pd) => pd.procedureLibrary, {
    cascade: ['insert', 'update', 'remove'],
  })
  procedure: Procedures[];

  @AfterLoad()
  async updateStepsAndPopulateSignedURLs() {
    this.procedureSteps = this.procedureSteps?.sort(
      (a, b) => a?.order - b?.order,
    );
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

  constructor(entity: Partial<ProceduresLibrary>) {
    super(entity);
    Object.assign(this, entity);
  }
}
