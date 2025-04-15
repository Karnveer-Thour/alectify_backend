import { Test, TestingModule } from '@nestjs/testing';
import { IncidentReportTeamMembersService } from './incident-report-team-members.service';

describe('IncidentReportTeamMembersService', () => {
  let service: IncidentReportTeamMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentReportTeamMembersService],
    }).compile();

    service = module.get<IncidentReportTeamMembersService>(
      IncidentReportTeamMembersService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
