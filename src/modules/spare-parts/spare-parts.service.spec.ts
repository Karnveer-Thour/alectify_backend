import { Test, TestingModule } from '@nestjs/testing';
import { SparePartsService } from './spare-parts.service';

describe('SparePartsService', () => {
  let service: SparePartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SparePartsService],
    }).compile();

    service = module.get<SparePartsService>(SparePartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
