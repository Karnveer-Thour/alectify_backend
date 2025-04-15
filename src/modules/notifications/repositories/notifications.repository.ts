import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationsRepository extends BaseRepository<Notification> {
  constructor(private dataSource: DataSource) {
    super(Notification, dataSource);
  }
}
