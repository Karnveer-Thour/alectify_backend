import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ContractManagementRepository } from './Repositories/contract-management.repository';
import { OrganizationsService } from 'modules/organizations/organizations.service';
import { UsersService } from 'modules/users/users.service';
import { User } from 'modules/users/entities/user.entity';
import { UpdateContractManagementDto } from './Dtos/update-contract-management.dto';
import { ContractManagementDocumentRepository } from './Repositories/contract-management-document.entity';
import { ContractManagementDocumentDto } from './Dtos/contract-management-document.dto';
import { CreateContractDto } from './Dtos/create-contract-management.dto';
import { UserTypes } from 'modules/users/models/user-types.enum';
import { ProjectsRepository } from 'modules/projects/repositories/projects.repository';
import { ProjectsService } from 'modules/projects/projects.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Brackets } from 'typeorm';
import { order_by } from './models/order_by.enum';
import { order_field } from './models/order-field.enum';
import { GetAllContractManagementResponseDto } from './Dtos/get-all-contract-management-response.dto';
import { ContractManagementDocumentService } from './contract-management-document.service';

@Injectable()
export class ContractManagementService {
  constructor(
    private contractManagementRepository: ContractManagementRepository,
    private contractManagementDocumentRepository: ContractManagementDocumentRepository,
    private projectRepository: ProjectsRepository,
    private usersServices: UsersService,
    private organizationsServices: OrganizationsService,
    private projectsService: ProjectsService,
    private ContractManagementDocumentService: ContractManagementDocumentService,
  ) {}

  findTerm = (item) => {
    const newItem = {
      ...item,
      term:
        new Date(item.end_date).getMonth() -
        new Date(item.start_date).getMonth(),
    };
    return newItem;
  };

  async create(
    authUser: User,
    token: string,
    contractManagementData: CreateContractDto,
    files: Array<Express.Multer.File>,
  ): Promise<any> {
    try {
      const isAutheticated =
        await this.projectsService.findMasterProjectByUserIdAndProjectId(
          authUser.id,
          contractManagementData.project_id,
        );
      if (!isAutheticated) {
        return {
          status: false,
          statusCode: 403,
          message: 'You do not have permission to access this record',
        };
      }
      const existingUser = await this.usersServices.findByEmailWithOrganisation(
        contractManagementData.email,
      );
      const project = await this.projectRepository.findOne({
        where: { id: contractManagementData.project_id },
        relations: ['branch'],
      });
      if (!project) {
        throw new InternalServerErrorException('project not found');
      }
      if (existingUser) {
        contractManagementData.contact_user = existingUser;
        contractManagementData.organization = existingUser.organization;
      } else {
        const organization = await this.organizationsServices.findOneByName(
          contractManagementData.organization_name,
        );
        const user = new User({
          id: existingUser.id,
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

      //upload new documents logic

      if (files?.length) {
        const uploadedFiles =
          await this.ContractManagementDocumentService.uploadFiles(
            files,
            token,
            authUser,
          );

        await Promise.all(
          uploadedFiles.map(async (file) => {
            const documentData: ContractManagementDocumentDto = {
              filePath: file.url,
              fileName: file.originalname,
              fileType: file.mimetype,
              isActive: true,
              uploadedBy: authUser,
              contractManagement: result,
              message: 'File uploaded',
            };
            return await this.ContractManagementDocumentService.saveFile(
              documentData,
            );
          }),
        );
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
    user: User,
    token: string,
    files: Array<Express.Multer.File>,
  ): Promise<any> {
    try {
      const contractManagement =
        await this.contractManagementRepository.findOne({
          where: { id: id },
          relations: ['contact_user','contact_user.branch.company', 'project', 'organization'],
        });
      const isAutheticated =
        await this.projectsService.findMasterProjectByUserIdAndProjectId(
          user.id,
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

      const result = await this.contractManagementRepository.save(
        newContractManagement,
      );

     const value= await this.ContractManagementDocumentService.uploadImagesForCMQueue(
        files,
        user,
        token,
        { ...contractManagementData },
        contractManagement,
      );

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

      const data = this.findTerm(result);

      return {
        status: true,
        statusCode: 200,
        data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll(
    search: string,
    order_field: order_field,
    order_by: order_by,
    is_recurring: boolean,
    is_active: boolean,
    options: IPaginationOptions,
  ): Promise<GetAllContractManagementResponseDto> {
    try {
      const limit = parseInt(options.limit as string);
      const page = parseInt(options.page as string);

      const contract_management = this.contractManagementRepository
        .createQueryBuilder('cM')
        .leftJoinAndSelect('cM.project', 'project')
        .leftJoinAndSelect('cM.contact_user', 'contact_user')
        .leftJoinAndSelect('cM.organization', 'organization');

      if (search) {
        contract_management.andWhere(
          new Brackets((cM) => {
            cM.orWhere('cM.comments ILIKE :comments', {
              comments: `%${search}%`,
            })
              .orWhere('cM.description ILIKE :description', {
                description: `%${search}%`,
              })
              .orWhere('organization.name ILIKE :org_name', {
                org_name: `%${search}%`,
              })
              .orWhere(
                "(contact_user.first_name || ' ' || contact_user.last_name) ILIKE :full_name",
                {
                  full_name: `%${search}%`,
                },
              );
          }),
        );
      }

      const active_filter = typeof is_active === 'boolean' ? is_active : true;
      contract_management.andWhere('cM.is_active = :is_active', {
        is_active: active_filter,
      });
      if (typeof is_recurring === 'boolean') {
        contract_management.andWhere('cM.is_recurring = :is_recurring', {
          is_recurring,
        });
      }

      if (order_field && order_by) {
        contract_management.orderBy(`cM.${order_field}`, order_by);
      } else {
        contract_management.orderBy('cM.createdAt', 'DESC');
      }

      contract_management.skip((page - 1) * limit).take(limit);

      let [data, count] = await contract_management.getManyAndCount();

      const finalData = [];

      data.map((item) => {
        const newItem = this.findTerm(item);
        finalData.push(newItem);
      });

      return {
        message: 'Get all contract management successfully',
        data: finalData,
        meta: {
          currentPage: page,
          itemCount: data.length,
          itemsPerPage: limit,
          totalItems: count,
          totalPages: Math.ceil(count / limit),
        },
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
