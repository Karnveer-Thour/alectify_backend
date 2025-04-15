import { Test, TestingModule } from '@nestjs/testing';
import { MasterPreventiveMaintenanceDocumentsService } from './master-preventive-maintenance-documents.service';

describe('MasterPreventiveMaintenanceDocumentsService', () => {
  let service: MasterPreventiveMaintenanceDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterPreventiveMaintenanceDocumentsService],
    }).compile();

    service = module.get<MasterPreventiveMaintenanceDocumentsService>(
      MasterPreventiveMaintenanceDocumentsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
