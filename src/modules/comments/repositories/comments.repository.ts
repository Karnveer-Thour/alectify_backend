import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentsRepository extends BaseRepository<Comment> {
  constructor(private dataSource: DataSource) {
    super(Comment, dataSource);
  }
}
