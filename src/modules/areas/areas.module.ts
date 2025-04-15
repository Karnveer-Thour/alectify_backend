import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { AreasRepository } from './repositories/areas.repository';
import { ProjectsModule } from '../projects/projects.module';
import { UsersRepository } from 'modules/users/repositories/users.repository';

@Module({
  imports: [ProjectsModule],
  controllers: [AreasController],
  providers: [AreasService, AreasRepository, UsersRepository],
  exports: [AreasService],
})
export class AreasModule {}
