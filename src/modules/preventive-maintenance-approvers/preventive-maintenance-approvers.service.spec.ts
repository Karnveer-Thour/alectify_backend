import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenanceApproversService } from './preventive-maintenance-approvers.service';

describe('PreventiveMaintenanceApproversService', () => {
  let service: PreventiveMaintenanceApproversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreventiveMaintenanceApproversService],
    }).compile();

    service = module.get<PreventiveMaintenanceApproversService>(
      PreventiveMaintenanceApproversService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
