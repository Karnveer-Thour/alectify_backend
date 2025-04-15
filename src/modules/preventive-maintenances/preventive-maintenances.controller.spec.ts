import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenancesController } from './preventive-maintenances.controller';
import { PreventiveMaintenancesService } from './preventive-maintenances.service';

describe('PreventiveMaintenancesController', () => {
  let controller: PreventiveMaintenancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreventiveMaintenancesController],
      providers: [PreventiveMaintenancesService],
    }).compile();

    controller = module.get<PreventiveMaintenancesController>(
      PreventiveMaintenancesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
