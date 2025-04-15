import { Test, TestingModule } from '@nestjs/testing';
import { HttpWrapper } from './http-wrapper';

describe('HttpWrapper', () => {
  let service: HttpWrapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpWrapper],
    }).compile();

    service = module.get<HttpWrapper>(HttpWrapper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
