import { fieldRender, teamMemberAvatar } from '@common/helpers/hbs-function';
import {
  FIREBASE_CONFIG,
  FirebaseConfigInterface,
} from '@core/firebase/firebase.config';
import { initFirebase } from '@core/firebase/firebase.init';
import { SENTRY_CONFIG, SentryInterface } from '@core/sentry/sentry.config';
import { initSentry } from '@core/sentry/sentry.init';
import { CACHE_MANAGER, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import Handlebars from 'handlebars';
import { join } from 'path';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exception-filters';
import {
  ENV_CONFIG,
  EnvConfigInterface,
} from './core/environment/environment.config';
import {
  SENDGRID_CONFIG,
  SendGridConfigInterface,
} from './core/sendgrid/sendgrid-mailer.config';
import { initSendGrid } from './core/sendgrid/sendgrid.config';
import { setupSwaggerConfig } from './core/swagger/swagger.config';
import { displayDate } from '@common/utils/utils';
import { CacheManager } from '@common/helpers/cache-manager';

async function bootstrap() {
  const PREFIX = '/api/v1';

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Apply helmet middleware with HSTS enabled
  app.use(helmet());

  app.enableCors();
  app.use(compression());

  const firebaseConfig = app
    .get(ConfigService)
    .get<FirebaseConfigInterface>(FIREBASE_CONFIG);

  const sendgridConfig = app
    .get(ConfigService)
    .get<SendGridConfigInterface>(SENDGRID_CONFIG);

  const sentryConfig = app
    .get(ConfigService)
    .get<SentryInterface>(SENTRY_CONFIG);

  const envConfig = app.get(ConfigService).get<EnvConfigInterface>(ENV_CONFIG);

  app.setGlobalPrefix(PREFIX);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // catch all exception and return custom respone

  app.useGlobalFilters(new AllExceptionsFilter(envConfig.nodeEnv));

  setupSwaggerConfig(PREFIX.concat('/docs'), app);
  // initSentry(sentryConfig.sentryDns, envConfig.nodeEnv);
  // initFirebase(firebaseConfig);
  initSendGrid(sendgridConfig.sendgridPrivateKey);
  const cache = app.get(CACHE_MANAGER);
  CacheManager.cache = cache; // set the static reference
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  Handlebars.registerHelper('displayDate', displayDate);
  Handlebars.registerHelper('teamMemberAvatar', teamMemberAvatar);
  Handlebars.registerHelper('fieldRender', fieldRender);

  await app.listen(envConfig.port);
}
bootstrap();
