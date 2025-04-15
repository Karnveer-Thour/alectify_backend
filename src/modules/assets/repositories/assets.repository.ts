import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Asset } from '../entities/asset.entity';

@Injectable()
export class AssetsRepository extends BaseRepository<Asset> {
  constructor(private dataSource: DataSource) {
    super(Asset, dataSource);
  }
}
