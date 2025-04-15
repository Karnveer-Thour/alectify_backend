import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenancesService } from './preventive-maintenances.service';

describe('PreventiveMaintenancesService', () => {
  let service: PreventiveMaintenancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreventiveMaintenancesService],
    }).compile();

    service = module.get<PreventiveMaintenancesService>(
      PreventiveMaintenancesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
