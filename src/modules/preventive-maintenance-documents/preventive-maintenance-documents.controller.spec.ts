import { Test, TestingModule } from '@nestjs/testing';
import { PreventiveMaintenanceDocumentsController } from './preventive-maintenance-documents.controller';
import { PreventiveMaintenanceDocumentsService } from './preventive-maintenance-documents.service';

describe('PreventiveMaintenanceDocumentsController', () => {
  let controller: PreventiveMaintenanceDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreventiveMaintenanceDocumentsController],
      providers: [PreventiveMaintenanceDocumentsService],
    }).compile();

    controller = module.get<PreventiveMaintenanceDocumentsController>(
      PreventiveMaintenanceDocumentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
