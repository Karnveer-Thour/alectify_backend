import { AfterLoad, Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ProjectSparePart } from './project-spare-part.entity';
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

@Entity('spare_parts')
@Index(['partNumber'])
export class SparePart extends BaseEntity<SparePart> {
  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({
    name: 'part_number',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  partNumber: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @OneToMany(() => ProjectSparePart, (psp) => psp.sparePart)
  projectSpareParts: ProjectSparePart[];

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

  constructor(entity: Partial<SparePart>) {
    super(entity);
    Object.assign(this, entity);
  }
}
