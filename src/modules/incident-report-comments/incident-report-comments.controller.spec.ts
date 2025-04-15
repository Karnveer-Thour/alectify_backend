import { Test, TestingModule } from '@nestjs/testing';
import { IncidentReportCommentsController } from './incident-report-comments.controller';
import { IncidentReportCommentsService } from './incident-report-comments.service';

describe('IncidentReportCommentsController', () => {
  let controller: IncidentReportCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentReportCommentsController],
      providers: [IncidentReportCommentsService],
    }).compile();

    controller = module.get<IncidentReportCommentsController>(
      IncidentReportCommentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
