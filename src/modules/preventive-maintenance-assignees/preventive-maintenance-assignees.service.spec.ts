import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenanceAssigneesService } from './preventive-maintenance-assignees.service';

describe('PreventiveMaintenanceAssigneesService', () => {
  let service: PreventiveMaintenanceAssigneesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreventiveMaintenanceAssigneesService],
    }).compile();

    service = module.get<PreventiveMaintenanceAssigneesService>(
      PreventiveMaintenanceAssigneesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
