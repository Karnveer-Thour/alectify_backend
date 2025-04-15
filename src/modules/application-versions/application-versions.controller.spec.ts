import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationVersionsController } from './application-versions.controller';
import { ApplicationVersionsService } from './application-versions.service';

describe('ApplicationVersionsController', () => {
  let controller: ApplicationVersionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationVersionsController],
      providers: [ApplicationVersionsService],
    }).compile();

    controller = module.get<ApplicationVersionsController>(
      ApplicationVersionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
