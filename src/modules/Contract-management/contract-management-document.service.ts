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

@Injectable()
export class ContractManagementDocumentService {
  constructor(
    private contractManagementDocumentRepository: ContractManagementDocumentRepository,
    private readonly fileUploadService: FilesUploadService,
    @InjectQueue('contractManagementDocuments')
    private readonly cmDocumentsQueue: Queue,
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
  ) {
    try {
      let uploadedImages = [];

      if (cmDto.deletefilesIds?.length) {
        const images = await this.contractManagementDocumentRepository.find({
          where: { id: In(cmDto.deletefilesIds) },
        });

        if (images.length !== cmDto.deletefilesIds.length) {
          throw new Error('Any of given document id does not exist');
        }

        await this.deleteImagesByIds(user, cmDto.deletefilesIds);
      }

      if (documents) {
        [uploadedImages] = await Promise.all([
          documents?.length
            ? this.fileUploadService.multiFileUpload(
                documents['images'],
                'contract-management',
                true,
                token,
                user.branch.company.id,
              )
            : [],
        ]);
      }

      // Helper function to prepare upload data
      const prepareUploadData = (files) =>
        files?.map((file) => ({
          fileName: file.fileName || file.originalname,
          filePath: file.filePath || file.key,
          fileType: file.fileType || file.mimetype,
          uploadedBy: file.uploadedBy || user,
          updatedAt: dateToUTC(),
          createdAt: dateToUTC(),
        })) || [];

      if (uploadedImages.length || cmDto.existingFiles?.length) {
        const uploadImages = [
          ...prepareUploadData(uploadedImages),
          ...prepareUploadData(cmDto.existingFiles),
        ];
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
  ) {
    return this.cmDocumentsQueue.add('uploadFilesAndImagesForCM', {
      documents,
      user,
      token,
      cmDto,
    });
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
