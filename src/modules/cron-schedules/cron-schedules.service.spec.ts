import { Test, TestingModule } from '@nestjs/testing';
import { CronSchedulesService } from './cron-schedules.service';

describe('CronSchedulesService', () => {
  let service: CronSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronSchedulesService],
    }).compile();

    service = module.get<CronSchedulesService>(CronSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
