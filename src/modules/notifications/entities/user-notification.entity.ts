import { BaseEntity } from '@common/entities/base.entity';
import { User } from 'modules/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Notification } from './notification.entity';

@Entity('notification_users')
@Index(['user', 'notification'])
export class UserNotification extends BaseEntity<UserNotification> {
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Notification, (notification) => notification.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'notification_id' })
  notification: Notification;

  @Column({ name: 'is_read', type: 'bool', default: false, nullable: false })
  isRead: boolean;

  constructor(entity: Partial<UserNotification>) {
    super(entity);
    Object.assign(this, entity);
  }
}
