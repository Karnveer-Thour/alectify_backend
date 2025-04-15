import { registerAs } from '@nestjs/config';

export enum EnvConfigEnum {
  DEV = 'DEV',
  TEST = 'TEST',
  STAGING = 'STAGING',
  PROD = 'PROD',
}

export interface EnvConfigInterface {
  nodeEnv: string;
  port: number;
}

export const ENV_CONFIG = 'ENV_CONFIG';

export const envConfig = registerAs<EnvConfigInterface>(ENV_CONFIG, () => {
  const {
    env: { NODE_ENV, PORT },
  } = process;

  return { nodeEnv: NODE_ENV, port: +PORT };
});
