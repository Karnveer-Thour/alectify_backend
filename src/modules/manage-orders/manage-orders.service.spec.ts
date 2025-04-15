import { Test, TestingModule } from '@nestjs/testing';
import { ManageOrdersService } from './manage-orders.service';

describe('ManageOrdersService', () => {
  let service: ManageOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManageOrdersService],
    }).compile();

    service = module.get<ManageOrdersService>(ManageOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
