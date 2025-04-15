import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenanceAssetsService } from './preventive-maintenance-assets.service';

describe('PreventiveMaintenanceAssetsService', () => {
  let service: PreventiveMaintenanceAssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreventiveMaintenanceAssetsService],
    }).compile();

    service = module.get<PreventiveMaintenanceAssetsService>(
      PreventiveMaintenanceAssetsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
