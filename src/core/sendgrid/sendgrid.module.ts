import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SendGridConfig } from './sendgrid-mailer.config';
import { SendGridService } from './sendgrid.service';

@Module({
  imports: [ConfigModule.forFeature(SendGridConfig)],
  providers: [SendGridService],
  exports: [SendGridService],
})
export class SendGridModule {}
