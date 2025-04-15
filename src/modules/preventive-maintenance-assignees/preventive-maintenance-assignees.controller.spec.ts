import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenanceAssigneesController } from './preventive-maintenance-assignees.controller';
import { PreventiveMaintenanceAssigneesService } from './preventive-maintenance-assignees.service';

describe('PreventiveMaintenanceAssigneesController', () => {
  let controller: PreventiveMaintenanceAssigneesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreventiveMaintenanceAssigneesController],
      providers: [PreventiveMaintenanceAssigneesService],
    }).compile();

    controller = module.get<PreventiveMaintenanceAssigneesController>(
      PreventiveMaintenanceAssigneesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
