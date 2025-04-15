import { Test, TestingModule } from '@nestjs/testing';
import { IncidentReportTeamMembersController } from './incident-report-team-members.controller';
import { IncidentReportTeamMembersService } from './incident-report-team-members.service';

describe('IncidentReportTeamMembersController', () => {
  let controller: IncidentReportTeamMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentReportTeamMembersController],
      providers: [IncidentReportTeamMembersService],
    }).compile();

    controller = module.get<IncidentReportTeamMembersController>(
      IncidentReportTeamMembersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
