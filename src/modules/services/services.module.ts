import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServicesRepository } from './repositories/services.repository';
import { ProceduresModule } from 'modules/procedures/procedures.module';
import { ProjectsModule } from 'modules/projects/projects.module';

@Module({
  imports: [ProceduresModule, ProjectsModule],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService],
})
export class ServicesModule {}
