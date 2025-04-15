import { Test, TestingModule } from '@nestjs/testing';
import { IncidentReportsService } from './incident-reports.service';

describe('IncidentReportsService', () => {
  let service: IncidentReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentReportsService],
    }).compile();

    service = module.get<IncidentReportsService>(IncidentReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
