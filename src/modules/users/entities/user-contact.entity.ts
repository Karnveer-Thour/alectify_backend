import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Index('unique_user_contact', ['contact', 'user'], { unique: true })
@Index('user_contact_contact_id_f5f31fdf', ['contact'], {})
@Index('user_contact_pkey', ['id'], { unique: true })
@Index('user_contact_user_id_06fd0470', ['user'], {})
@Entity('user_contact')
export class UserContact {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @ManyToOne(() => User, (user) => user.userContacts)
  @JoinColumn([{ name: 'contact_id', referencedColumnName: 'id' }])
  contact: User;

  @ManyToOne(() => User, (user) => user.userContacts2)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
