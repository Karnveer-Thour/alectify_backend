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

@Injectable()
export class ContractManagementService {
  constructor(
    private contractManagementRepository: ContractManagementRepository,
    private contractManagementDocumentRepository: ContractManagementDocumentRepository,
    private projectRepository: ProjectsRepository,
    private usersServices: UsersService,
    private organizationsServices: OrganizationsService,
    private fileUploadService: FilesUploadService,
  ) {}

  async create(
    userId: string,
    token: string,
    contractManagementData: CreateContractDto,
    files: Array<Express.Multer.File>,
  ): Promise<any> {
    try {
      const authUser = await this.usersServices.findOneById(userId);
      const user = await this.usersServices.findByEmailWithOrganisation(
        contractManagementData.userEmail,
      );
      const project = await this.projectRepository.findOne({
        where: { id: contractManagementData.projectId },
        relations: ['branch'],
      });
      debugger;
      if (!project) {
        throw new InternalServerErrorException('project not found');
      }
      contractManagementData.project = project;
      const organization = await this.organizationsServices.findOneByName(
        contractManagementData.organizationName,
      );
      if (user) {
        contractManagementData.contactUser = user;
        contractManagementData.organization = organization;
      } else {
        const user = new User({
          id: userId,
          first_name: contractManagementData.userFirstName,
          last_name: contractManagementData.userLastName,
          email: contractManagementData.userEmail,
          password: 'Fdjkshfkdjshfe@3839798',
          isSuperuser: false,
          isStaff: true,
          isActive: true,
          emailVerified: true,
          dateJoined: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          image_url: contractManagementData.userImageUrl,
          user_type: UserTypes.CUSTOMER,
          address: '',
          businessAddress: '',
          branch: project.branch,
          organization: organization,
        });

        const newUser = await this.usersServices.createOne(user);
        console.log(newUser);
        if (organization) {
          contractManagementData.contactUser = newUser;
          contractManagementData.organization = organization;
        } else {
          contractManagementData.contactUser = newUser;
          contractManagementData.organization = organization;
        }
      }
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
                  contractManagement: null,
                  message: 'File uploaded',
                };
                const uploadedFileData =
                  this.contractManagementDocumentRepository.save(documentData);
                return uploadedFileData;
              }),
            )
          ).map((item) => item.id);
        }
      const result = await this.contractManagementRepository.save(
        contractManagementData,
      );
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
  ): Promise<any> {
    try {
      const contractManagement =
        await this.contractManagementRepository.findOne({
          where: { id: id },
        });
      if (!contractManagement) {
        return 'Record does not exists';
      }
      let newContractManagement = {
        description: '',
        contractNumber: '',
        contractAmount: 0,
        comments: '',
      };

      newContractManagement.description =
        contractManagementData.description ?? contractManagement.description;
      newContractManagement.contractNumber =
        contractManagementData.contractNumber ??
        contractManagement.contractNumber;
      newContractManagement.contractAmount =
        contractManagementData.contractAmount ??
        contractManagement.contractAmount;
      newContractManagement.comments =
        contractManagementData.comments ?? contractManagement.comments;

      const result = await this.contractManagementRepository.update(
        { id: id },
        newContractManagement,
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

  async getById(id: string): Promise<any> {
    try {
      const result = await this.contractManagementRepository.findOne({
        where: { id: id },
      });
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
      const result = await this.contractManagementRepository.find();
      return {
        status: true,
        statusCode: 200,
        data: result,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async softDeleteById(id: string): Promise<any> {
    try {
      const result = await this.contractManagementRepository.softDelete(id);
      return {
        status: true,
        statusCode: 200,
        data: result,
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
