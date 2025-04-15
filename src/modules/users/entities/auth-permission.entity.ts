import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DjangoContentType } from './django-content-type.entity';
import { GroupPermission } from './group-permission.entity';
import { UserUserPermission } from './user-user-permission.entity';

@Entity('auth_permission')
@Index(
  'auth_permission_content_type_id_codename_01ab375a_uniq',
  ['codename', 'contentType'],
  { unique: true },
)
@Index('auth_permission_content_type_id_2f476e4b', ['contentType'], {})
// @Index('auth_permission_pkey', ['id'], { unique: true })
export class AuthPermission {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'codename', type: 'varchar', unique: true, length: 100 })
  codename: string;

  @OneToMany(
    () => GroupPermission,
    (groupPermission) => groupPermission.permission,
  )
  GroupPermissions: GroupPermission[];

  @ManyToOne(
    () => DjangoContentType,
    (djangoContentType) => djangoContentType.authPermissions,
    {
      nullable: false,
    },
  )
  @JoinColumn([{ name: 'content_type_id', referencedColumnName: 'id' }])
  contentType: DjangoContentType;

  @OneToMany(
    () => UserUserPermission,
    (userUserPermission) => userUserPermission.permission,
  )
  userUserPermissions: UserUserPermission[];
}
