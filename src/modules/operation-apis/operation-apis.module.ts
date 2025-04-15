import { HttpWrapperModule } from '@common/http-wrapper/http-wrapper.module';
import { OperationAPIsConfig } from '@core/operation-apis/operation-apis.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OperationApisWrapper } from './operation-apis-wrapper';
import { LLMAPIsConfig } from '@core/llm-apis/llm-apis.config';

@Module({
  imports: [
    ConfigModule.forFeature(OperationAPIsConfig),
    ConfigModule.forFeature(LLMAPIsConfig),
    HttpWrapperModule,
  ],
  providers: [OperationApisWrapper],
  exports: [OperationApisWrapper],
})
export class OperationApisModule {}
