import { Test, TestingModule } from '@nestjs/testing';
import { ManageOrdersController } from './manage-orders.controller';
import { ManageOrdersService } from './manage-orders.service';

describe('ManageOrdersController', () => {
  let controller: ManageOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManageOrdersController],
      providers: [ManageOrdersService],
    }).compile();

    controller = module.get<ManageOrdersController>(ManageOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
