import { Module } from '@nestjs/common';
import { TimelinesViewRepository } from './repositories/timelines-view.repository';
import { TimelinesController } from './timelines.controller';
import { TimelinesService } from './timelines.service';

@Module({
  imports: [],
  controllers: [TimelinesController],
  providers: [TimelinesViewRepository, TimelinesService],
  exports: [TimelinesService],
})
export class TimelinesModule {}
