import { Module } from '@nestjs/common';
import { ApplicationVersionsController } from './application-versions.controller';
import { ApplicationVersionsService } from './application-versions.service';
import { ApplicationVersionsRepository } from './repositories/application-versions.repository';

@Module({
  imports: [],
  controllers: [ApplicationVersionsController],
  providers: [ApplicationVersionsService, ApplicationVersionsRepository],
  exports: [],
})
export class ApplicationVersionsModule {}
