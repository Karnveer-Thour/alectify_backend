import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('notifications_fcmtoken')
@Index(
  'notifications_fcmtoken_token_device_type_013b2c86_uniq',
  ['deviceType', 'token'],
  { unique: true },
)
@Index('notifications_fcmtoken_pkey', ['id'], { unique: true })
@Index('notifications_fcmtoken_user_id_5fab7af0', ['userId'], {})
export class UserFcmToken {
  @Column('timestamp with time zone', { name: 'created_at' })
  createdAt: Date;

  @Column('timestamp with time zone', { name: 'updated_at' })
  updatedAt: Date;

  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('character varying', { name: 'token', unique: true, length: 255 })
  token: string;

  @Column('character varying', {
    name: 'device_type',
    unique: true,
    length: 10,
  })
  deviceType: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.notificationFcmToken)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
