import { Injectable } from '@nestjs/common';
import { ContractManagementDocumentRepository } from './Repositories/contract-management-document.entity';
import { FilesUploadService } from 'modules/files-upload/files-upload.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { dateToUTC } from '@common/utils/utils';
import { In } from 'typeorm';
import { User } from 'modules/users/entities/user.entity';
import { UpdateContractManagementDto } from './Dtos/update-contract-management.dto';
import { ContractManagementDocumentDto } from './Dtos/contract-management-document.dto';
import { ContractManagement } from './entities/contract-management.entity';

@Injectable()
export class ContractManagementDocumentService {
  constructor(
    private contractManagementDocumentRepository: ContractManagementDocumentRepository,
    private readonly fileUploadService: FilesUploadService,
    @InjectQueue('contractManagementDocuments')
    private readonly cmDocumentsQueue: Queue,
    private contractManagementRepository: ContractManagementDocumentRepository,
  ) {}

  uploadFiles = async (
    files: Array<Express.Multer.File>,
    token: string,
    authUser: User,
  ) => {
    const uploadedFiles = await this.fileUploadService.multiFileUpload(
      files,
      'incident-reports',
      true,
      token,
      authUser,
    );
    return uploadedFiles;
  };

  saveFile = async (uploadedFileData: ContractManagementDocumentDto) => {
    const savedFileData =
      this.contractManagementDocumentRepository.save(uploadedFileData);
    return savedFileData;
  };

  async uploadImagesForCM(
    documents: Array<Express.Multer.File>,
    user: User,
    token: string,
    cmDto: UpdateContractManagementDto,
    cm: ContractManagement,
  ) {
    try {
      let uploadedImages = [];
      if (documents) {
        uploadedImages = await this.fileUploadService.multiFileUpload(
          documents,
          'contract-management',
          true,
          token,
          user.branch.company.id,
        );
      }

      // Helper function to prepare upload data
      const prepareUploadData = (
        files: (ContractManagementDocumentDto | Express.Multer.File)[],
      ): ContractManagementDocumentDto[] =>
        files?.map((file: any) => ({
          fileName: file.fileName || file.originalname || '',
          filePath: file.filePath || file.key || '',
          fileType: file.fileType || file.mimetype || '',
          uploadedBy: user,
          updatedAt: dateToUTC(),
          createdAt: dateToUTC(),
          contractManagement: cm,
          isActive: typeof file?.isActive === 'boolean' ? file.isActive : true,
        })) || [];

      if (uploadedImages.length || cmDto.importedFiles?.length) {
        const uploadImages = [];
        if (uploadImages.length) {
          uploadImages.push(...prepareUploadData(uploadedImages));
        }
        if (cmDto.importedFiles?.length) {
          uploadImages.push(...prepareUploadData(cmDto.importedFiles));
        }
        const promises: any = [this.insertManyImages(uploadImages)];
        await Promise.all(promises);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async uploadImagesForCMQueue(
    documents: Array<Express.Multer.File>,
    user: User,
    token: string,
    cmDto: UpdateContractManagementDto,
    cm: ContractManagement,
  ) {
    const value = await this.cmDocumentsQueue.add('uploadFilesAndImagesForCM', {
      documents,
      user,
      token,
      cmDto,
      cm,
    });
    return value;
  }

  async deleteImagesByIds(user, ids) {
    try {
      await this.contractManagementDocumentRepository.update(
        {
          id: In(ids),
        },
        {
          isActive: false,
          softDeletedAt: dateToUTC(),
          deletedBy: user.id,
        },
      );
      return {
        message: 'Contract Management images deleted',
        data: {},
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteFilesByIds(user, ids) {
    try {
      await this.contractManagementDocumentRepository.update(
        {
          id: In(ids),
        },
        {
          isActive: false,
          softDeletedAt: dateToUTC(),
          deletedBy: user.id,
        },
      );
      return {
        message: 'Contract Management files deleted',
        data: {},
      };
    } catch (error) {
      throw error;
    }
  }

  async insertManyImages(data) {
    try {
      return await this.contractManagementDocumentRepository.insert(data);
    } catch (error) {
      throw error;
    }
  }

  async insertManyFiles(data) {
    try {
      return await this.contractManagementDocumentRepository.insert(data);
    } catch (error) {
      throw error;
    }
  }
}
