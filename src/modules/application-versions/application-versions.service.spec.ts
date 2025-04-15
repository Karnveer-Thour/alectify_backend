import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationVersionsService } from './application-versions.service';

describe('ApplicationVersionsService', () => {
  let service: ApplicationVersionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationVersionsService],
    }).compile();

    service = module.get<ApplicationVersionsService>(
      ApplicationVersionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
