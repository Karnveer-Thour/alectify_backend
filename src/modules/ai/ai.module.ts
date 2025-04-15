import { AIConfig } from '@core/ai/ai.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIService } from './ai-service';
import { FilesUploadModule } from 'modules/files-upload/files-upload.module';

@Module({
  imports: [ConfigModule.forFeature(AIConfig), FilesUploadModule],
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}
