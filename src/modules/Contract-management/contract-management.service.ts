import { Injectable } from '@nestjs/common';
import { ContractManagementRepository } from './Repositories/contract-management.repository';
import { OrganizationsService } from 'modules/organizations/organizations.service';
import { UsersService } from 'modules/users/users.service';
import { User } from 'modules/users/entities/user.entity';
import { ContractManagementDto } from './Dtos/contract-management.dto';
import { ContractManagement } from './entities/contract-management.entity';
import { Organization } from 'modules/organizations/entities/organization.entity';

@Injectable()
export class ContractManagementService {
  constructor(
    private contractManagement: ContractManagementRepository,
    private usersServices: UsersService,
    private organizationsServices:OrganizationsService,
  ) {}

  async createContractManagement(
    userData:User,
    contractManagementData: ContractManagement,
  ): Promise<any> {
    try {
        const user=await this.usersServices.findByEmailWithOrganisation(userData.email);
    if(user){
        contractManagementData.contactUser = user;
        contractManagementData.organization=user.organization;
    }else{
        const organization=await this.organizationsServices.findOneByName(userData.organization.name);
        if(organization){
            const newUser=await this.usersServices.createOne(userData);
            contractManagementData.organization=organization;
            contractManagementData.contactUser = newUser;
        }else{
            const newOrganization=await this.organizationsServices.findOneByNameOrCreate(userData.organization.name);
            const newUser=await this.usersServices.createOne(userData);
            contractManagementData.organization=newOrganization;
            contractManagementData.contactUser = newUser;
        }
    }
    return await this.contractManagement.save(contractManagementData);
    } catch (error) {
        throw new Error(error);
    }
  }
}
