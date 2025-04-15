import { Injectable } from '@nestjs/common';
import {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory as TypeOrmOptionsFactoryInterface,
} from '@nestjs/typeorm';
import { InjectConfig } from '@common/decorators/inject-config.decorator';
import { DatabaseConfig, DatabaseConfigType } from '../database.config';

@Injectable()
export class TypeOrmOptionsFactory implements TypeOrmOptionsFactoryInterface {
  constructor(
    @InjectConfig(DatabaseConfig)
    private readonly databaseConfigFactory: DatabaseConfigType,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const databaseSecrets = this.databaseConfigFactory;
    return {
      ...databaseSecrets,
      name: databaseSecrets?.name ?? 'default',
      ssl: false,
      extra: {
        // ssl: {
        //   rejectUnauthorized: false,
        // },
      },
    };
  }
}
