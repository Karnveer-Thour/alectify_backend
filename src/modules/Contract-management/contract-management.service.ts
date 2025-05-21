import { Injectable } from '@nestjs/common';
import { ContractManagementRepository } from './Repositories/contract-management.repository';
import { OrganizationsService } from 'modules/organizations/organizations.service';
import { UsersService } from 'modules/users/users.service';
import { User } from 'modules/users/entities/user.entity';
import { ContractManagement } from './entities/contract-management.entity';
import { UpdateContractManagementDto } from './Dtos/update-contract-management.dto';

@Injectable()
export class ContractManagementService {
  constructor(
    private contractManagementRepository: ContractManagementRepository,
    private usersServices: UsersService,
    private organizationsServices:OrganizationsService,
  ) {}

  async create(
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
    return await this.contractManagementRepository.save(contractManagementData);
    } catch (error) {
        throw new Error(error);
    }
  }

  async update(contractManagementData:ContractManagement):Promise<any>{
    try {
      const contractManagement=await this.contractManagementRepository.findOne({where:{id:contractManagementData.id}});
      if(!contractManagement){
        return "Record does not exists";
      }
      const newContractManagement:UpdateContractManagementDto={
        description:contractManagementData.description,
        contractNumber:contractManagementData.contractNumber,
        contractAmount:contractManagementData.contractAmount,
        comments:contractManagementData.comments,
        message: 'Contract management updated successfully'
      }
      return this.contractManagementRepository.update({id:contractManagementData.id},newContractManagement);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id:string):Promise<any>{
    try {
      const contractManagement=await this.contractManagementRepository.findOne({where:{id:id}});
      if(!contractManagement){
        return "Record does not exists";
      }
      return contractManagement;
    } catch (error) {
      throw new Error(error);
    }
  }
}
