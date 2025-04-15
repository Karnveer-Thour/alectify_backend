import { ConfigType, registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const DATABASE_CONFIG = 'DATABASE_CONFIG';
export const DatabaseConfig = registerAs<Partial<TypeOrmModuleOptions>>(
  DATABASE_CONFIG,
  (): Partial<TypeOrmModuleOptions> => {
    const {
      env: {
        TYPEORM_HOST,
        TYPEORM_CONNECTION,
        TYPEORM_PORT,
        TYPEORM_DATABASE,
        TYPEORM_PASSWORD,
        TYPEORM_USERNAME,
        TYPEORM_SYNCHRONIZE,
        TYPEORM_LOGGING,
        TYPEORM_ENTITIES,
        TYPEORM_SEEDING_FACTORIES,
        TYPEORM_SEEDING_SEEDS,
        TYPEORM_MIGRATIONS,
        TYPEORM_SUBSCRIBERS,
        DROP_SCHEMA,
      },
    } = process;
    return {
      database: TYPEORM_DATABASE,
      entities: [TYPEORM_ENTITIES],
      host: TYPEORM_HOST,
      logging: TYPEORM_LOGGING === 'true',
      migrations: [TYPEORM_MIGRATIONS],
      subscribers: [TYPEORM_SUBSCRIBERS],
      password: TYPEORM_PASSWORD,
      port: +TYPEORM_PORT,
      synchronize: TYPEORM_SYNCHRONIZE === 'true',
      type: TYPEORM_CONNECTION as PostgresConnectionOptions['type'],
      username: TYPEORM_USERNAME,
      dropSchema: DROP_SCHEMA === 'true',
    };
  },
);

export type DatabaseConfigType = ConfigType<typeof DatabaseConfig>;
