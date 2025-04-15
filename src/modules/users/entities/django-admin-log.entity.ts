import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DjangoContentType } from './django-content-type.entity';
import { User } from './user.entity';

@Entity('django_admin_log')
@Index('django_admin_log_content_type_id_c4bce8eb', ['contentType'], {})
// @Index('django_admin_log_pkey', ['id'], { unique: true })
@Index('django_admin_log_user_id_c564eba6', ['user'], {})
export class DjangoAdminLog {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ name: 'action_time', type: 'timestamp with time zone' })
  actionTime: Date;

  @Column({ name: 'object_id', type: 'text', nullable: true })
  objectId: string | null;

  @Column({ name: 'object_repr', type: 'varchar', length: 200 })
  objectRepr: string;

  @Column({ name: 'action_flag', type: 'smallint' })
  actionFlag: number;

  @Column({ name: 'change_message', type: 'text' })
  changeMessage: string;

  @ManyToOne(
    () => DjangoContentType,
    (djangoContentType) => djangoContentType.djangoAdminLogs,
  )
  @JoinColumn([{ name: 'content_type_id', referencedColumnName: 'id' }])
  contentType: DjangoContentType;

  @ManyToOne(() => User, (user) => user.djangoAdminLogs, {
    nullable: false,
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
