// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
export const dataSourceOptions: DataSourceOptions = {
  database: process.env.TYPEORM_DATABASE,
  entities: [process.env.TYPEORM_ENTITIES],
  host: process.env.TYPEORM_HOST,
  logging: process.env.TYPEORM_LOGGING === 'true',
  migrations: [process.env.TYPEORM_MIGRATIONS],
  subscribers: [process.env.TYPEORM_SUBSCRIBERS],
  password: process.env.TYPEORM_PASSWORD,
  port: +process.env.TYPEORM_PORT,
  type: process.env.TYPEORM_CONNECTION as PostgresConnectionOptions['type'],
  username: process.env.TYPEORM_USERNAME,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
