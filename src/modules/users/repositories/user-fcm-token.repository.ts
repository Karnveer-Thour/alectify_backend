import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserFcmToken } from '../entities/user-fcm-token.entity';
import { BaseRepository } from '@common/repositories/base.repository';

@Injectable()
export class UserFcmTokenRepository extends BaseRepository<UserFcmToken> {
  constructor(private dataSource: DataSource) {
    super(UserFcmToken, dataSource);
  }
}
