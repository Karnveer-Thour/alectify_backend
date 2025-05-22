import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BypassAuth } from 'modules/users/decorators/bypass.decorator';
import { ContractManagementService } from './contract-management.service';
import { ContractManagement } from './entities/contract-management.entity';
import { CreateContractDto } from './Dtos/create-contract.dto';
import { disAllowedExtensions, getFileNameFromFiles } from '@common/utils/utils';

@ApiTags('contract-management')
@Controller('contract-management')
export class ContractManagementController {
  constructor(private contractManagementService: ContractManagementService) {}

  @Post()
  @BypassAuth()
  async create(@Req() req,@Body() createContract: CreateContractDto,@UploadedFiles()files: Array<Express.Multer.File>): Promise<any> {
    if (files?.length) {
          const fileNames = getFileNameFromFiles(files);
          const checkFiles = disAllowedExtensions(fileNames);
          if (checkFiles.length) {
            throw new BadRequestException(
              `File type ${checkFiles[0]} is not allowed.`,
            );
          }
        }
    return await this.contractManagementService.create(
      req.user.id,
      req.headers.authorization,
      createContract.user,
      createContract.contractManagement,
      files
    );
  }

  @Put('/update')
  @BypassAuth()
  async update(@Body() contractManagement: ContractManagement): Promise<any> {
    return await this.contractManagementService.update(contractManagement);
  }

  @Get(':id')
  @BypassAuth()
  async getById(@Param('id') id: string): Promise<any> {
    return await this.contractManagementService.getById(id);
  }

  @Get()
  @BypassAuth()
  async getAll(): Promise<any> {
    return await this.contractManagementService.getAll();
  }

  @Delete(':id')
  @BypassAuth()
  async softDeleteById(@Param('id') id: string): Promise<any> {
    return await this.contractManagementService.softDeleteById(id);
  }

  @Delete('document/:id')
  @BypassAuth()
  async softDeleteDocumentById(@Param('id') id: string): Promise<any> {
    return await this.contractManagementService.softDeleteDocumentById(id);
  }
}
