import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserNotification } from '../entities/user-notification.entity';

@Injectable()
export class UserNotificationsRepository extends BaseRepository<UserNotification> {
  constructor(private dataSource: DataSource) {
    super(UserNotification, dataSource);
  }
}
