import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenanceTeamMembersService } from './preventive-maintenance-team-members.service';

describe('PreventiveMaintenanceTeamMembersService', () => {
  let service: PreventiveMaintenanceTeamMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreventiveMaintenanceTeamMembersService],
    }).compile();

    service = module.get<PreventiveMaintenanceTeamMembersService>(
      PreventiveMaintenanceTeamMembersService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
