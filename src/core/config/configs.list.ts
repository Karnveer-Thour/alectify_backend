import { ConfigFactory } from '@nestjs/config';
import { DatabaseConfig } from '../database/database.config';
import { envConfig } from '../environment/environment.config';
import { JWTConfig } from '../jwt/jwt.config';
import { AWSConfig } from '../aws/aws.config';
import { SendGridConfig } from '../sendgrid/sendgrid-mailer.config';
import { OperationAPIsConfig } from '@core/operation-apis/operation-apis.config';
import { LLMAPIsConfig } from '@core/llm-apis/llm-apis.config';
import { SentryConfig } from '@core/sentry/sentry.config';
import { FirebaseConfig } from '@core/firebase/firebase.config';
import { AIConfig } from '@core/ai/ai.config';

type ConfigFactoryReturnValue =
  | Record<string, any>
  | Promise<Record<string, any>>;

export const configs: ConfigFactory<ConfigFactoryReturnValue>[] = [
  envConfig,
  DatabaseConfig,
  JWTConfig,
  AWSConfig,
  SendGridConfig,
  OperationAPIsConfig,
  LLMAPIsConfig,
  SentryConfig,
  FirebaseConfig,
  AIConfig,
];
