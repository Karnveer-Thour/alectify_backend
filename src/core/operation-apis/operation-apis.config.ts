import { ConfigType, registerAs } from '@nestjs/config';

export interface OperationApisInterface {
  djangoOperationUrl: string;
}

export const OPERATION_API_CONFIG = 'OPERATION_API_CONFIG';

export const OperationAPIsConfig = registerAs<OperationApisInterface>(
  OPERATION_API_CONFIG,
  () => {
    const {
      env: { DJANGO_OPERATION_URL },
    } = process;

    return {
      djangoOperationUrl: DJANGO_OPERATION_URL,
    };
  },
);
export type OperationAPIsConfigType = ConfigType<typeof OperationAPIsConfig>;
