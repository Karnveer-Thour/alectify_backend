import { BaseEntity } from '@common/entities/base.entity';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Project } from '../..//projects/entities/project.entity';
import { PreventiveMaintenances } from '../../preventive-maintenances/entities/preventive-maintenances.entity';
import { SubProject } from '../../projects/entities/sub-project.entity';
import { User } from '../../users/entities/user.entity';
import { Folders } from '../models/folders.enum';
import { S3 } from '@common/helpers/s3';

const {
  env: {
    AWS_S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_REGION,
  },
} = process;

const s3 = new S3(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_REGION);

@Entity('preventive_maintenance_documents')
export class PreventiveMaintenanceDocuments extends BaseEntity<PreventiveMaintenanceDocuments> {
  @ManyToOne(() => Project, (pro) => pro.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => SubProject, (sp) => sp.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'sub_project_id' })
  subProject: SubProject;

  @ManyToOne(() => PreventiveMaintenances, (pm) => pm.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'preventive_maintenance_id' })
  preventiveMaintenance: PreventiveMaintenances;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  uploadedBy: User;

  @Column({
    name: 'folder',
    type: 'enum',
    enum: Folders,
    nullable: false,
  })
  folder: Folders;

  @Column({ name: 'file_name', type: 'varchar', nullable: false })
  fileName: string;

  @Column({ name: 'file_path', type: 'text', nullable: false })
  filePath: string;

  @Column({ name: 'file_type', type: 'varchar', nullable: false })
  fileType: string;

  @Column({ name: 'is_active', type: 'bool', nullable: false, default: true })
  isActive: boolean;

  @Column({
    name: 'soft_deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  softDeletedAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'deleted_by' })
  deletedBy: User;

  @Column({ name: 'comment', type: 'varchar', nullable: true })
  comment: string;

  @Column({
    name: 'recovered_at',
    type: 'timestamp',
    nullable: true,
  })
  recoveredAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'recovered_by' })
  recoveredBy: User;

  @Column({ name: 'speech_transcript', type: 'text', nullable: true })
  speechTranscript: string;

  // Static flag to control if URLs should be signed
  private static signUrls = false;

  // Method to set the flag for URL signing
  static setSignUrls(shouldSign: boolean) {
    PreventiveMaintenanceDocuments.signUrls = shouldSign;
  }

  // After entity is loaded from DB, this will run if `signUrls` is true
  @AfterLoad()
  async populateSignedURLs() {
    if (PreventiveMaintenanceDocuments.signUrls && this.filePath) {
      const signedUrl = await s3.privateSignedUrl(
        AWS_S3_BUCKET_NAME,
        this.filePath,
        604800, // 24 hours
      );
      this.filePath = signedUrl;
    }
  }

  constructor(entity: Partial<PreventiveMaintenanceDocuments>) {
    super(entity);
    Object.assign(this, entity);
  }
}
