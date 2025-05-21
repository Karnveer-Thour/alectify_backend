import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BypassAuth } from 'modules/users/decorators/bypass.decorator';
import { ContractManagementService } from './contract-management.service';
import { ContractManagement } from './entities/contract-management.entity';
import { CreateContractDto } from './Dtos/create-contract.dto';

@ApiTags('contract-management')
@Controller('contract-management')
export class ContractManagementController {
  constructor(private contractManagementService: ContractManagementService) {}

  @Post()
  @BypassAuth()
  async create(@Body() createContract: CreateContractDto): Promise<any> {
    return await this.contractManagementService.create(
      createContract.user,
      createContract.contractManagement,
    );
  }

  @Put()
  @BypassAuth()
  async update(@Body() contractManagement: ContractManagement): Promise<any> {
    return await this.contractManagementService.update(contractManagement);
  }

  @Get()
  @BypassAuth()
  async getById(@Body() id: string): Promise<any> {
    return await this.contractManagementService.getById(id);
  }
}
