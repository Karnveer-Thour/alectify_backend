import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Services } from './service.entity';
import { User } from 'modules/users/entities/user.entity';

@Entity()
export class ServicesUsers {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @ManyToOne(() => Services, (service) => service.id)
  @JoinColumn({ name: 'service_id' })
  service: Services;

  @CreateDateColumn()
  created_at: 'datetime';

  @UpdateDateColumn()
  updated_at: 'datetime';

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
