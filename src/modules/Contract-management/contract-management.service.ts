import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ContractManagementRepository } from './Repositories/contract-management.repository';
import { OrganizationsService } from 'modules/organizations/organizations.service';
import { UsersService } from 'modules/users/users.service';
import { User } from 'modules/users/entities/user.entity';
import { ContractManagement } from './entities/contract-management.entity';
import { UpdateContractManagementDto } from './Dtos/update-contract-management.dto';
import { ContractManagementDocumentRepository } from './Repositories/contract-management-document.entity';
import { FilesUploadService } from 'modules/files-upload/files-upload.service';
import { ContractManagementDocumentDto } from './Dtos/contract-management-document.dto';
import { CreateContractDto } from './Dtos/create-contract.dto';
import { UserTypes } from 'modules/users/models/user-types.enum';
import { ProjectsRepository } from 'modules/projects/repositories/projects.repository';
import { ProjectsService } from 'modules/projects/projects.service';
import { UsersRepository } from 'modules/users/repositories/users.repository';

@Injectable()
export class ContractManagementService {
  constructor(
    private contractManagementRepository: ContractManagementRepository,
    private contractManagementDocumentRepository: ContractManagementDocumentRepository,
    private projectRepository: ProjectsRepository,
    private usersServices: UsersService,
    private organizationsServices: OrganizationsService,
    private projectsService: ProjectsService,
    private fileUploadService: FilesUploadService,
  ) {}

  async create(
    userId: string,
    token: string,
    contractManagementData: CreateContractDto,
    files: Array<Express.Multer.File>,
  ): Promise<any> {
    try {
      const isAutheticated =
        await this.projectsService.findMasterProjectByUserIdAndProjectId(
          userId,
          contractManagementData.project_id,
        );
      if (!isAutheticated) {
        return {
          status: false,
          statusCode: 403,
          message: 'You do not have permission to access this record',
        };
      }
      const authUser = await this.usersServices.findOneById(userId);
      const user = await this.usersServices.findByEmailWithOrganisation(
        contractManagementData.email,
      );
      const project = await this.projectRepository.findOne({
        where: { id: contractManagementData.project_id },
        relations: ['branch'],
      });
      if (!project) {
        throw new InternalServerErrorException('project not found');
      }
      if (user) {
        contractManagementData.contact_user = user;
        contractManagementData.organization = user.organization;
      } else {
        const organization = await this.organizationsServices.findOneByName(
          contractManagementData.organization_name,
        );
        const user = new User({
          id: userId,
          first_name: contractManagementData.first_name,
          last_name: contractManagementData.last_name,
          email: contractManagementData.email,
          password: 'Fdjkshfkdjshfe@3839798',
          isSuperuser: false,
          isStaff: true,
          isActive: true,
          emailVerified: true,
          dateJoined: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          user_type: UserTypes.CUSTOMER,
          address: '',
          businessAddress: '',
          branch: project.branch,
          organization: organization,
        });
        if (organization) {
          const newUser = await this.usersServices.createOne(user);
          contractManagementData.contact_user = newUser;
          contractManagementData.organization = organization;
        } else {
          const newOrganization =
            await this.organizationsServices.findOneByNameOrCreate(
              contractManagementData.organization_name,
            );
          user.organization = newOrganization;
          const newUser = await this.usersServices.createOne(user);
          contractManagementData.contact_user = newUser;
          contractManagementData.organization = newOrganization;
        }
      }
      const newContractManagement = {
        ...contractManagementData,
        project,
      };
      const result = await this.contractManagementRepository.save(
        newContractManagement,
      );
      //uploaded documents logic

      let uploadedDocumentIds = [];
      if (files)
        if (files.length) {
          const uploadedFiles = await this.fileUploadService.multiFileUpload(
            files,
            'incident-reports',
            true,
            token,
            authUser.branch.company.id,
          );
          uploadedDocumentIds = (
            await Promise.all(
              uploadedFiles.map((file) => {
                const documentData: ContractManagementDocumentDto = {
                  filePath: file.url,
                  fileName: file.originalname,
                  fileType: file.mimetype,
                  isActive: true,
                  uploadedBy: user,
                  contractManagement: result,
                  message: 'File uploaded',
                };
                const uploadedFileData =
                  this.contractManagementDocumentRepository.save(documentData);
                return uploadedFileData;
              }),
            )
          ).map((item) => item.id);
        }

      return {
        status: true,
        statusCode: 200,
        data: result,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    contractManagementData: UpdateContractManagementDto,
    id: string,
    userId: string,
  ): Promise<any> {
    try {
      const contractManagement =
        await this.contractManagementRepository.findOne({
          where: { id: id },
          relations: ['contact_user', 'project', 'organization'],
        });
      const isAutheticated =
        await this.projectsService.findMasterProjectByUserIdAndProjectId(
          userId,
          contractManagement.project.id,
        );
      if (!isAutheticated) {
        return {
          status: false,
          statusCode: 403,
          message: 'You do not have permission to access this record',
        };
      }
      if (!contractManagement) {
        return 'Record does not exists';
      }
      const newContractManagement = {
        ...contractManagement,
        description:
          contractManagementData.description ?? contractManagement.description,
        contract_number:
          contractManagementData.contractNumber ??
          contractManagement.contract_number,
        contract_amount:
          contractManagementData.contractAmount ??
          contractManagement.contract_amount,
        comments:
          contractManagementData.comments ?? contractManagement.comments,
      };

      const result = await this.contractManagementRepository.save(newContractManagement);
      return {
        message: 'Contract management was updated successfully',
        data: result,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id: string, userId: string): Promise<any> {
    try {
      const result = await this.contractManagementRepository.findOne({
        where: { id: id },
        relations: ['contact_user', 'project', 'organization'],
      });
      const isAutheticated =
        await this.projectsService.findMasterProjectByUserIdAndProjectId(
          userId,
          result.project.id,
        );
      if (!isAutheticated) {
        return {
          status: false,
          statusCode: 403,
          message: 'You do not have permission to access this record',
        };
      }
      if (!result) {
        return 'Record does not exists';
      }
      return {
        status: true,
        statusCode: 200,
        data: result,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll(): Promise<any> {
    try {
      const result = await this.contractManagementRepository.find({
        relations: ['contact_user', 'project', 'organization'],
      });
      const finalResult=[];
      result.map((cM)=>{
        if(cM.is_active===true){
          finalResult.push(cM);
        }
      })
      return {
        status: true,
        statusCode: 200,
        data: finalResult,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async softDeleteById(id: string, userId): Promise<any> {
    try {
      const result = await this.contractManagementRepository.findOne({
        where: { id: id },
        relations: ['project'],
      });
      const isAutheticated =
        await this.projectsService.findMasterProjectByUserIdAndProjectId(
          userId,
          result.project.id,
        );
      if (!isAutheticated) {
        return {
          status: false,
          statusCode: 403,
          message: 'You do not have permission to access this record',
        };
      }
      result.is_active = false;
      await this.contractManagementRepository.save(result);
      return {
        status: true,
        statusCode: 200,
        data: `contract management #${result.id} has been deleted.`,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async softDeleteDocumentById(id: string): Promise<any> {
    try {
      const result = await this.contractManagementDocumentRepository.softDelete(
        id,
      );
      return {
        status: true,
        statusCode: 200,
        data: result,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
