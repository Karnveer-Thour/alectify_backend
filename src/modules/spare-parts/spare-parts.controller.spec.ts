import { Test, TestingModule } from '@nestjs/testing';
import { SparePartsController } from './spare-parts.controller';
import { SparePartsService } from './spare-parts.service';

describe('SparePartsController', () => {
  let controller: SparePartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SparePartsController],
      providers: [SparePartsService],
    }).compile();

    controller = module.get<SparePartsController>(SparePartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
