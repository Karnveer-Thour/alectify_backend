import { Test, TestingModule } from '@nestjs/testing';
import { SparePartCategoriesController } from './spare-part-categories.controller';
import { SparePartCategoriesService } from './spare-part-categories.service';

describe('SparePartCategoriesController', () => {
  let controller: SparePartCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SparePartCategoriesController],
      providers: [SparePartCategoriesService],
    }).compile();

    controller = module.get<SparePartCategoriesController>(
      SparePartCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
