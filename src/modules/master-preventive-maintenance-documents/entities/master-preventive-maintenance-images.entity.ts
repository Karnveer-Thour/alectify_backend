import { BaseEntity } from '@common/entities/base.entity';
import { S3 } from '@common/helpers/s3';
import { MasterPreventiveMaintenances } from '../../preventive-maintenances/entities/master-preventive-maintenances.entity';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

const {
  env: {
    AWS_S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_REGION,
  },
} = process;

const s3 = new S3(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_REGION);

@Entity('master_preventive_maintenance_images')
export class MasterPreventiveMaintenanceImages extends BaseEntity<MasterPreventiveMaintenanceImages> {
  @ManyToOne(() => MasterPreventiveMaintenances, (pm) => pm.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'master_preventive_maintenance_id' })
  masterPreventiveMaintenance: MasterPreventiveMaintenances;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  uploadedBy: User;

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

  // After entity is loaded from DB, this will run if `signUrls` is true
  @AfterLoad()
  async populateSignedURLs() {
    if (this.filePath) {
      const signedUrl = await s3.privateSignedUrl(
        AWS_S3_BUCKET_NAME,
        this.filePath,
        604800, // 24 hours
      );
      this.filePath = signedUrl;
    }
  }

  constructor(entity: Partial<MasterPreventiveMaintenanceImages>) {
    super(entity);
    Object.assign(this, entity);
  }
}
