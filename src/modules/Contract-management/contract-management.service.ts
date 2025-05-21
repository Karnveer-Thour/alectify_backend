import { Injectable } from '@nestjs/common';
import { ContractManagementRepository } from './Repositories/contract-management.repository';
import { OrganizationsService } from 'modules/organizations/organizations.service';
import { UsersService } from 'modules/users/users.service';
import { User } from 'modules/users/entities/user.entity';
import { ContractManagement } from './entities/contract-management.entity';
import { UpdateContractManagementDto } from './Dtos/update-contract-management.dto';
import { ContractManagementDocumentRepository } from './Repositories/contract-management-document.entity';
import { CreateUserDto } from 'modules/users/dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { ContractManagementDto } from './Dtos/contract-management.dto';

@Injectable()
export class ContractManagementService {
  constructor(
    private contractManagementRepository: ContractManagementRepository,
    private contractManagementDocumentRepository: ContractManagementDocumentRepository,
    private usersServices: UsersService,
    private organizationsServices: OrganizationsService,
  ) {}

  async create(
    userData: CreateUserDto,
    contractManagementData: ContractManagementDto,
  ): Promise<any> {
    try {
      const user = await this.usersServices.findByEmailWithOrganisation(
        userData.email,
      );
      if (user) {
        contractManagementData.contactUser = user.id;
        contractManagementData.organization = user.organization.id;
      } else {
        const organization = await this.organizationsServices.findOneByName(
          userData.organization.name,
        );
        if (organization) {
          const userEntity = plainToInstance(User, userData);
          await this.usersServices.createOne(userEntity);
          contractManagementData.contactUser = user.id;
          contractManagementData.organization = user.organization.id;
        } else {
          await this.organizationsServices.findOneByNameOrCreate(
            userData.organization.name,
          );
          const userEntity = plainToInstance(User, userData);
          await this.usersServices.createOne(userEntity);
          contractManagementData.contactUser = user.id;
          contractManagementData.organization = user.organization.id;
        }
      }
      const contract = this.contractManagementRepository.create({
        ...contractManagementData,
        project: { id: contractManagementData.project },
        organization: { id: contractManagementData.organization },
        contactUser: { id: contractManagementData.contactUser },
      });
      return await this.contractManagementRepository.save(contract);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(contractManagementData: ContractManagement): Promise<any> {
    try {
      const contractManagement =
        await this.contractManagementRepository.findOne({
          where: { id: contractManagementData.id },
        });
      if (!contractManagement) {
        return 'Record does not exists';
      }
      const newContractManagement: UpdateContractManagementDto = {
        description: contractManagementData.description,
        contractNumber: contractManagementData.contractNumber,
        contractAmount: contractManagementData.contractAmount,
        comments: contractManagementData.comments,
        message: 'Contract management updated successfully',
      };
      return this.contractManagementRepository.update(
        { id: contractManagementData.id },
        newContractManagement,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id: string): Promise<any> {
    try {
      const contractManagement =
        await this.contractManagementRepository.findOne({ where: { id: id } });
      if (!contractManagement) {
        return 'Record does not exists';
      }
      return contractManagement;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll(): Promise<any> {
    try {
      return await this.contractManagementRepository.find();
    } catch (error) {
      throw new Error(error);
    }
  }

  async softDeleteById(id: string): Promise<any> {
    try {
      return await this.contractManagementRepository.softDelete(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async softDeleteDocumentById(id: string): Promise<any> {
    try {
      return await this.contractManagementDocumentRepository.softDelete(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
