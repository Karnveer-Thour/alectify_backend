import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpWrapper } from './http-wrapper';

@Module({
  imports: [HttpModule],
  providers: [HttpWrapper],
  exports: [HttpWrapper],
})
export class HttpWrapperModule {}
