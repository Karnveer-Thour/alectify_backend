import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserGroup } from './user-group.entity';
import { GroupPermission } from './group-permission.entity';

@Entity('auth_group')
// @Index('auth_group_pkey', ['id'], { unique: true })
// @Index('auth_group_name_key', ['name'], { unique: true })
@Index('auth_group_name_a6ea08ec_like', ['name'], {})
export class Group {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', unique: true, length: 150 })
  name: string;

  @OneToMany(() => GroupPermission, (groupPermission) => groupPermission.group)
  groupPermissions: GroupPermission[];

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  UserGroups: UserGroup[];
}
