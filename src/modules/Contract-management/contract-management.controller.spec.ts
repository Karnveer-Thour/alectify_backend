import { Test, TestingModule } from '@nestjs/testing';
import { ContractManagementController } from './contract-management.controller';

describe('ContractManagementController', () => {
  let controller: ContractManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractManagementController],
    }).compile();

    controller = module.get<ContractManagementController>(
      ContractManagementController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
