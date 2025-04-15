import { ConfigType, registerAs } from '@nestjs/config';

export interface SentryInterface {
  sentryDns: string;
  sentryAuthToken: string;
}

export const SENTRY_CONFIG = 'SENTRY_CONFIG';

export const SentryConfig = registerAs<SentryInterface>(SENTRY_CONFIG, () => {
  const {
    env: { SENTRY_DNS, SENTRY_AUTH_TOKEN },
  } = process;

  return {
    sentryDns: SENTRY_DNS,
    sentryAuthToken: SENTRY_AUTH_TOKEN,
  };
});
export type OperationAPIsConfigType = ConfigType<typeof SentryConfig>;
