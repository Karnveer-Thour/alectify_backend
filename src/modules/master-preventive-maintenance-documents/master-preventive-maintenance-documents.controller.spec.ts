import { Test, TestingModule } from '@nestjs/testing';
import { MasterPreventiveMaintenanceDocumentsController } from './master-preventive-maintenance-documents.controller';
import { MasterPreventiveMaintenanceDocumentsService } from './master-preventive-maintenance-documents.service';

describe('MasterPreventiveMaintenanceDocumentsController', () => {
  let controller: MasterPreventiveMaintenanceDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterPreventiveMaintenanceDocumentsController],
      providers: [MasterPreventiveMaintenanceDocumentsService],
    }).compile();

    controller = module.get<MasterPreventiveMaintenanceDocumentsController>(
      MasterPreventiveMaintenanceDocumentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
