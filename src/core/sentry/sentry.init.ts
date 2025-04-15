import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

export function initSentry(dsn: string, environment: string) {
  Sentry.init({
    dsn,
    environment,
    integrations: [new ProfilingIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
    enableTracing: true,
  });
}

export function sentryLog({ operation, name, error }): void {
  const transaction = Sentry.startTransaction({
    op: operation,
    name: name,
  });

  Sentry.captureException(error);

  transaction?.finish();
}
