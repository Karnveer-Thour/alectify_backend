import { Test, TestingModule } from '@nestjs/testing';
import { IncidentReportsController } from './incident-reports.controller';
import { IncidentReportsService } from './incident-reports.service';

describe('IncidentReportsController', () => {
  let controller: IncidentReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentReportsController],
      providers: [IncidentReportsService],
    }).compile();

    controller = module.get<IncidentReportsController>(
      IncidentReportsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
