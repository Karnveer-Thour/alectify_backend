import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProceduresLibrary } from './procedures-library-entity';
import { BaseEntity } from '@common/entities/base.entity';
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
@Entity('procedure_library_steps')
export class ProcedureLibrarySteps extends BaseEntity<ProcedureLibrarySteps> {
  @Column({ name: 'name', type: 'varchar', nullable: true })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'order_no', type: 'int', nullable: true })
  order: number;

  @ManyToOne(() => ProceduresLibrary, (procedure) => procedure.procedureSteps)
  @JoinColumn({ name: 'procedure_library_id', referencedColumnName: 'id' })
  procedureLibrary: ProceduresLibrary;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string;

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

  constructor(entity: Partial<ProcedureLibrarySteps>) {
    super(entity);
    Object.assign(this, entity);
  }
}
