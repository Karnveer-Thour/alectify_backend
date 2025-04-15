import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configs } from './configs.list';
import { validationSchema } from './validation.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['.env'],
      load: configs,
      validationSchema,
      validationOptions: {
        // Allow unknown is set to true because setting it to false will throw `Config validation error` on other environment variables.
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
})
export class ConfigModule {}
