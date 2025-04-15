import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenanceDocumentsService } from './preventive-maintenance-documents.service';

describe('PreventiveMaintenanceDocumentsService', () => {
  let service: PreventiveMaintenanceDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreventiveMaintenanceDocumentsService],
    }).compile();

    service = module.get<PreventiveMaintenanceDocumentsService>(
      PreventiveMaintenanceDocumentsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
