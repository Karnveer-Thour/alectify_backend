import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenanceAssetsController } from './preventive-maintenance-assets.controller';
import { PreventiveMaintenanceAssetsService } from './preventive-maintenance-assets.service';

describe('PreventiveMaintenanceAssetsController', () => {
  let controller: PreventiveMaintenanceAssetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreventiveMaintenanceAssetsController],
      providers: [PreventiveMaintenanceAssetsService],
    }).compile();

    controller = module.get<PreventiveMaintenanceAssetsController>(
      PreventiveMaintenanceAssetsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
