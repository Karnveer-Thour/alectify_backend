import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BypassAuth } from 'modules/users/decorators/bypass.decorator';
import { ContractManagementService } from './contract-management.service';
import { ContractManagement } from './entities/contract-management.entity';
import { CreateContractDto } from './Dtos/create-contract.dto';
import {
  disAllowedExtensions,
  getFileNameFromFiles,
} from '@common/utils/utils';
import { UpdateContractManagementDto } from './Dtos/update-contract-management.dto';
import { GetAllContractManagementQueryDto } from './Dtos/get-all-contract-management.dto';

@ApiBearerAuth()
@ApiTags('contract-management')
@Controller('contract-management')
export class ContractManagementController {
  constructor(private contractManagementService: ContractManagementService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createContract: CreateContractDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
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
      createContract,
      files,
    );
  }

  @Put('/update/:id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() contractManagement: UpdateContractManagementDto,
  ): Promise<any> {
    return await this.contractManagementService.update(contractManagement, id,req.user.id);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Req() req): Promise<any> {
    return await this.contractManagementService.getById(id, req.user.id);
  }

  @Get()
  async getAll(
    @Req() req,
    @Query(){
    limit=10,
    page=1,
    organization_Name=null,
    contact_userId=null,
    description=null,
    comments=null,
    // contract_amount=null,
    order_field=null,
    order_by=null,
    is_recurring=null,
  }:GetAllContractManagementQueryDto,): Promise<any> {
    return await this.contractManagementService.getAll(
      organization_Name,
      contact_userId,
      description,
      comments,
      // contract_amount,
      order_field,
      order_by,
      is_recurring,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },);
  }

  @Delete(':id')
  async softDeleteById(@Param('id') id: string,@Req() req,): Promise<any> {
    return await this.contractManagementService.softDeleteById(id,req.user.id);
  }

  @Delete('document/:id')
  async softDeleteDocumentById(@Param('id') id: string): Promise<any> {
    return await this.contractManagementService.softDeleteDocumentById(id);
  }
}
