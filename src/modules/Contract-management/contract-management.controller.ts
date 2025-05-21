import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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

  @Put('/update')
  @BypassAuth()
  async update(@Body() contractManagement: ContractManagement): Promise<any> {
    return await this.contractManagementService.update(contractManagement);
  }

  @Get(':id')
  @BypassAuth()
  async getById(@Param() id: string): Promise<any> {
    return await this.contractManagementService.getById(id);
  }

  @Get()
  @BypassAuth()
  async getAll(): Promise<any> {
    return await this.contractManagementService.getAll();
  }

  @Delete(':id')
  @BypassAuth()
  async softDeletebyId(@Param() id: string): Promise<any> {
    return await this.contractManagementService.softDeleteById(id);
  }

  @Delete('document/:id')
  @BypassAuth()
  async softDeleteDocumentById(@Param() id: string): Promise<any> {
    return await this.contractManagementService.softDeleteDocumentById(id);
  }
}
