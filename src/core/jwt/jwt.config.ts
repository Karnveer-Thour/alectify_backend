import { ConfigType, registerAs } from '@nestjs/config';

export interface JwtConfigInterface {
  jwtSecret: string;
  jwtExpireIn: number;
}

export const JWT_CONFIG = 'JWT_CONFIG';

export const JWTConfig = registerAs<JwtConfigInterface>(JWT_CONFIG, () => {
  const {
    env: { JWT_SECRET, JWT_EXPIRES_IN },
  } = process;

  return { jwtSecret: JWT_SECRET, jwtExpireIn: +JWT_EXPIRES_IN };
});

export type JWTConfigType = ConfigType<typeof JWTConfig>;
