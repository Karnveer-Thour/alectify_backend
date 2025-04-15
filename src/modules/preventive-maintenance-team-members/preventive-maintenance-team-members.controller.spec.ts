import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenanceTeamMembersController } from './preventive-maintenance-team-members.controller';
import { PreventiveMaintenanceTeamMembersService } from './preventive-maintenance-team-members.service';

describe('PreventiveMaintenanceTeamMembersController', () => {
  let controller: PreventiveMaintenanceTeamMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreventiveMaintenanceTeamMembersController],
      providers: [PreventiveMaintenanceTeamMembersService],
    }).compile();

    controller = module.get<PreventiveMaintenanceTeamMembersController>(
      PreventiveMaintenanceTeamMembersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
