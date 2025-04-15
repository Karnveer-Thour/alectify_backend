import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenanceAreasService } from './preventive-maintenance-areas.service';

describe('PreventiveMaintenanceAreasService', () => {
  let service: PreventiveMaintenanceAreasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreventiveMaintenanceAreasService],
    }).compile();

    service = module.get<PreventiveMaintenanceAreasService>(
      PreventiveMaintenanceAreasService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
