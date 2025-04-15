import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AWSConfig } from '@core/aws/aws.config';
import { FilesUploadService } from './files-upload.service';
import { HttpWrapperModule } from '@common/http-wrapper/http-wrapper.module';
import { OperationApisModule } from 'modules/operation-apis/operation-apis.module';

@Module({
  imports: [ConfigModule.forFeature(AWSConfig), OperationApisModule],
  providers: [FilesUploadService],
  exports: [FilesUploadService],
})
export class FilesUploadModule {}
