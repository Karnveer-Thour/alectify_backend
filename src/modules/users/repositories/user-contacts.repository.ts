import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { UserContact } from '../entities/user-contact.entity';

@Injectable()
export class UserContactsRepository extends BaseRepository<UserContact> {
  constructor(private dataSource: DataSource) {
    super(UserContact, dataSource);
  }
}
