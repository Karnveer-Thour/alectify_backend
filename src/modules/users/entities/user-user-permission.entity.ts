import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { AuthPermission } from './auth-permission.entity';

@Entity('authentication_user_user_permissions')
// @Index('authentication_user_user_permissions_pkey', ['id'], { unique: true })
@Index(
  'authentication_user_user_permissions_permission_id_ea6be19a',
  ['permission'],
  {},
)
@Index(
  'authentication_user_user_user_id_permission_id_ec51b09f_uniq',
  ['permission', 'user'],
  { unique: true },
)
@Index('authentication_user_user_permissions_user_id_736ebf7e', ['user'], {})
export class UserUserPermission {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('uuid', { name: 'user_id', unique: true })
  userId: string;

  @Column('integer', { name: 'permission_id', unique: true })
  permissionId: number;

  @ManyToOne(
    () => AuthPermission,
    (permission) => permission.userUserPermissions,
  )
  @JoinColumn([{ name: 'permission_id', referencedColumnName: 'id' }])
  permission: AuthPermission;

  @ManyToOne(() => User, (user) => user.userUserPermissions, {
    nullable: false,
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
