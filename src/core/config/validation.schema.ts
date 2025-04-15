import * as Joi from 'joi';
import { EnvConfigEnum } from '../environment/environment.config';

export interface ConfigVariableInterface {
  AWS_S3_BUCKET_NAME: string;
  AWS_S3_REGION: string;
  AWS_DEFAULT_ACL: string;
  AWS_S3_BUCKET_URL: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;

  JWT_SECRET: string;
  TYPEORM_CONNECTION: string;
  TYPEORM_DATABASE: string;
  TYPEORM_HOST: string;
  TYPEORM_LOGGING: boolean;
  TYPEORM_PASSWORD: string;
  TYPEORM_PORT: number;
  TYPEORM_SYNCHRONIZE: boolean;
  TYPEORM_USERNAME: string;
  NODE_ENV: EnvConfigEnum;
  PORT: number;
  SENDGRID_PRIVATE_KEY: string;
  MAILER_FROM_EMAIL: string;
  MAILER_REPLY_EMAIL: string;

  DJANGO_OPERATION_URL: string;

  LLM_URL: string;

  FRONTEND_URL: string;

  SENTRY_DNS: string;
  SENTRY_AUTH_TOKEN: string;

  FIREBASE_PROJECT_ID: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;

  REDIS_HOST: string;
  REDIS_PORT: number;

  AI_API_KEY: string;
}

const validationSchema = Joi.object<ConfigVariableInterface>({
  //* AWS Config
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_S3_BUCKET_URL: Joi.string().required(),

  //* JWT Config
  JWT_SECRET: Joi.string().required(),

  //* TypeORM Config
  TYPEORM_CONNECTION: Joi.string().required(),
  TYPEORM_HOST: Joi.string().required(),
  TYPEORM_DATABASE: Joi.string().required(),
  TYPEORM_USERNAME: Joi.string().required(),
  TYPEORM_PASSWORD: Joi.optional(),
  TYPEORM_PORT: Joi.number().required(),
  TYPEORM_SYNCHRONIZE: Joi.boolean().required(),
  TYPEORM_LOGGING: Joi.boolean().required(),

  // * Node Env Config
  NODE_ENV: Joi.string()
    .allow(...Object.values(EnvConfigEnum))
    .required(),
  PORT: Joi.number().default(3000).required(),

  // * SendGrid
  SENDGRID_PRIVATE_KEY: Joi.string().required(),
  MAILER_FROM_EMAIL: Joi.string().email().required(),
  MAILER_REPLY_EMAIL: Joi.string().email().required(),

  // * API URL
  DJANGO_OPERATION_URL: Joi.string().required(),

  // * LLM API URL
  LLM_URL: Joi.string().required(),

  // * Frontend URL
  FRONTEND_URL: Joi.string().required(),

  // * Sentry
  SENTRY_DNS: Joi.string().required(),
  SENTRY_AUTH_TOKEN: Joi.string().required(),

  // * Firebase
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().required(),

  // * Redis
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),

  // * Open AI
  AI_API_KEY: Joi.string().optional(),
});
export { validationSchema };
