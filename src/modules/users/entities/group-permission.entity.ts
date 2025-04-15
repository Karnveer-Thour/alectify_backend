import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthPermission } from './auth-permission.entity';
import { Group } from './group.entity';

@Entity('auth_group_permissions')
@Index('auth_group_permissions_group_id_b120cbf9', ['group'], {})
@Index(
  'auth_group_permissions_group_id_permission_id_0cd325b0_uniq',
  ['group', 'permission'],
  { unique: true },
)
// @Index('auth_group_permissions_pkey', ['id'], { unique: true })
@Index('auth_group_permissions_permission_id_84c5c92e', ['permission'], {})
export class GroupPermission {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('integer', { name: 'group_id', unique: true })
  groupId: number;

  @Column('integer', { name: 'permission_id', unique: true })
  permissionId: number;

  @ManyToOne(() => Group, (group) => group.groupPermissions, {
    nullable: false,
  })
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'id' }])
  group: Group;

  @ManyToOne(
    () => AuthPermission,
    (authPermission) => authPermission.GroupPermissions,
    {
      nullable: false,
    },
  )
  @JoinColumn([{ name: 'permission_id', referencedColumnName: 'id' }])
  permission: AuthPermission;
}
