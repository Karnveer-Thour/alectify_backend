import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthPermission } from './auth-permission.entity';
import { DjangoAdminLog } from './django-admin-log.entity';
@Entity('django_content_type', { schema: 'public' })
@Index(
  'django_content_type_app_label_model_76bd3d3b_uniq',
  ['appLabel', 'model'],
  { unique: true },
)
// @Index('django_content_type_pkey', ['id'], { unique: true })
export class DjangoContentType {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ name: 'app_label', type: 'varchar', unique: true, length: 100 })
  appLabel: string;

  @Column({ name: 'model', type: 'varchar', unique: true, length: 100 })
  model: string;

  @OneToMany(
    () => AuthPermission,
    (authPermission) => authPermission.contentType,
  )
  authPermissions: AuthPermission[];

  @OneToMany(
    () => DjangoAdminLog,
    (djangoAdminLog) => djangoAdminLog.contentType,
  )
  djangoAdminLogs: DjangoAdminLog[];
}
