import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenanceAreasController } from './preventive-maintenance-areas.controller';
import { PreventiveMaintenanceAreasService } from './preventive-maintenance-areas.service';

describe('PreventiveMaintenanceAreasController', () => {
  let controller: PreventiveMaintenanceAreasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreventiveMaintenanceAreasController],
      providers: [PreventiveMaintenanceAreasService],
    }).compile();

    controller = module.get<PreventiveMaintenanceAreasController>(
      PreventiveMaintenanceAreasController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
