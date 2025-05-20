import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BypassAuth } from 'modules/users/decorators/bypass.decorator';

@ApiTags('contract-management')
@Controller('contract-management')
export class ContractManagementController {

    @Post()
    @BypassAuth()
    createContractManagement():string{
        return "Created";
    }
}