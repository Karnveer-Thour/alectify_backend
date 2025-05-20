import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BypassAuth } from 'modules/users/decorators/bypass.decorator';
import { ContractManagementService } from './contract-management.service';
import { User } from 'modules/users/entities/user.entity';
import { ContractManagement } from './entities/contract-management.entity';
import { CreateContractDto } from './Dtos/create-contract.dto';

@ApiTags('contract-management')
@Controller('contract-management')
export class ContractManagementController {
  constructor(private contractManagementService: ContractManagementService) {}

  @Post()
  @BypassAuth()
  async createContractManagement(
    @Body() createContract:CreateContractDto
  ): Promise<any> {
    return await this.contractManagementService.createContractManagement(
      createContract.user,
      createContract.contractManagement,
    );
  }
}