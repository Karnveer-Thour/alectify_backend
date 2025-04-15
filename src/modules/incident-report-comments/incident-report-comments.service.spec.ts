import { Test, TestingModule } from '@nestjs/testing';
import { IncidentReportCommentsService } from './incident-report-comments.service';

describe('IncidentReportCommentsService', () => {
  let service: IncidentReportCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentReportCommentsService],
    }).compile();

    service = module.get<IncidentReportCommentsService>(
      IncidentReportCommentsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
