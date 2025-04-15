import { Test, TestingModule } from '@nestjs/testing';
import { SparePartCategoriesService } from './spare-part-categories.service';

describe('SparePartCategoriesService', () => {
  let service: SparePartCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SparePartCategoriesService],
    }).compile();

    service = module.get<SparePartCategoriesService>(
      SparePartCategoriesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
