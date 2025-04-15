import { ConfigType, registerAs } from '@nestjs/config';

export interface FrontendConfigsInterface {
  frontendUrl: string;
}

export const FRONTEND_CONFIG = 'FRONTEND_CONFIG';

export const FrontendConfig = registerAs<FrontendConfigsInterface>(
  FRONTEND_CONFIG,
  () => {
    const {
      env: { FRONTEND_URL },
    } = process;

    return {
      frontendUrl: FRONTEND_URL,
    };
  },
);
export type FrontendConfigType = ConfigType<typeof FrontendConfig>;
