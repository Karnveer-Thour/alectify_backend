import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenanceApproversController } from './preventive-maintenance-approvers.controller';
import { PreventiveMaintenanceApproversService } from './preventive-maintenance-approvers.service';

describe('PreventiveMaintenanceApproversController', () => {
  let controller: PreventiveMaintenanceApproversController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreventiveMaintenanceApproversController],
      providers: [PreventiveMaintenanceApproversService],
    }).compile();

    controller = module.get<PreventiveMaintenanceApproversController>(
      PreventiveMaintenanceApproversController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
