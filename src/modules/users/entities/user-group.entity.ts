import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity('authentication_user_groups', { schema: 'public' })
@Index('authentication_user_groups_group_id_6b5c44b7', ['group'], {})
@Index(
  'authentication_user_groups_user_id_group_id_8af031ac_uniq',
  ['group', 'user'],
  { unique: true },
)
// @Index('authentication_user_groups_pkey', ['id'], { unique: true })
@Index('authentication_user_groups_user_id_30868577', ['user'], {})
export class UserGroup {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @ManyToOne(() => Group, (group) => group.UserGroups, {
    nullable: false,
  })
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'id' }])
  group: Group;

  @ManyToOne(() => User, (user) => user.userGroups, {
    nullable: false,
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
