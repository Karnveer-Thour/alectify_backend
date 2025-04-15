import { BaseEntity } from '@common/entities/base.entity';
import { S3 } from '@common/helpers/s3';
import { User } from 'modules/users/entities/user.entity';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Procedures } from './procedures-entity';

const {
  env: {
    AWS_S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_REGION,
  },
} = process;

const s3 = new S3(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_REGION);
@Entity('procedure_steps')
export class ProcedureSteps extends BaseEntity<ProcedureSteps> {
  @Column({ name: 'name', type: 'varchar', nullable: true })
  name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description: string;

  @Column({ name: 'order_no', type: 'int', nullable: true })
  order: number;

  @Column({ name: 'duration', type: 'varchar', nullable: true })
  durationMins: string;

  @Column({ name: 'comments', type: 'text', nullable: true })
  comments: string;

  @ManyToOne(
    () => Procedures,
    (masterprocedure) => masterprocedure.procedureSteps,
  )
  @JoinColumn({ name: 'procedure_id', referencedColumnName: 'id' })
  procedure: Procedures;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'completed_by_id' })
  completedBy: User;

  @Column({
    name: 'completed_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  completedAt: Date;

  @Column({
    name: 'is_checked',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isChecked: boolean;

  @Column({ name: 'default_image_url', type: 'varchar', nullable: true })
  defaultImageUrl: string;

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
    if (this.defaultImageUrl) {
      const signedUrl = await s3.privateSignedUrl(
        AWS_S3_BUCKET_NAME,
        this.defaultImageUrl,
        604800,
      );
      this.defaultImageUrl = signedUrl;
    } else {
      this.defaultImageUrl = this.defaultImageUrl;
    }
  }

  constructor(entity: Partial<ProcedureSteps>) {
    super(entity);
    Object.assign(this, entity);
  }
}
