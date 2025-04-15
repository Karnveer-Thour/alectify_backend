import { BaseResponseDto } from '@common/dto/base-response.dto';
import { dateToUTC, enumToTile } from '@common/utils/utils';
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { AreasService } from 'modules/areas/areas.service';
import { AssetsService } from 'modules/assets/assets.service';
import { CommentsService } from 'modules/comments/comments.service';
import { CommentsMessages } from 'modules/comments/models/comments-messages';
import { ContentTypes } from 'modules/comments/models/content-types';
import { FilesUploadService } from 'modules/files-upload/files-upload.service';
import { PreventiveMaintenances } from 'modules/preventive-maintenances/entities/preventive-maintenances.entity';
import { PreventiveMaintenancesService } from 'modules/preventive-maintenances/preventive-maintenances.service';
import { ProjectsService } from 'modules/projects/projects.service';
import { User } from 'modules/users/entities/user.entity';
import { UsersService } from 'modules/users/users.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Brackets, In, IsNull } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import {
  GetAllDocumentsResponseDto,
  GetAllDocumentsViewResponseDto,
  GetDocumentsViewCountResponseDto,
} from './dto/get-all-documents-response.dto';
import { RecoverAndUpdateDocumentDto } from './dto/recover-document.dto';
import { UploadFilesDto } from './dto/upload-document.dto';
import { DocumentsView } from './entities/documents-view.entity';
import { Documents } from './entities/documents.entity';
import { Folders } from './models/folders.enum';
import { DocumentsViewRepository } from './repositories/documents-view.repository';
import { DocumentsRepository } from './repositories/documents.repository';

@Injectable()
export class DocumentsService {
  constructor(
    private documentsViewRepository: DocumentsViewRepository,
    private documentsRepository: DocumentsRepository,
    private usersService: UsersService,
    private readonly fileUploadService: FilesUploadService,
    @Inject(forwardRef(() => PreventiveMaintenancesService))
    private pmService: PreventiveMaintenancesService,
    private projectsService: ProjectsService,
    private commentsService: CommentsService,
    private areasService: AreasService,
    private assetsService: AssetsService,
  ) {}

  async findAllDocumentsByAssetOrArea(
    id: string,
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    types: string[],
    search: string,
    isActive: string,
    options: IPaginationOptions,
  ): Promise<GetAllDocumentsViewResponseDto> {
    try {
      const documents = this.documentsViewRepository
        .createQueryBuilder('document')
        .where(
          new Brackets((qb) => {
            qb.where('document.assetId =:id', {
              id,
            }).orWhere('document.areaId =:id', {
              id,
            });
          }),
        );
      if (types.length) {
        documents.andWhere('document.type IN(:...types)', { types });
      }
      if (isActive === 'true') {
        documents.andWhere('document.isActive = True');
      } else if (isActive === 'false') {
        documents.andWhere('document.isActive = False');
      }
      if (search) {
        documents.andWhere(
          new Brackets((qb) => {
            qb.where('document.fileName ILIKE :search', {
              search: `%${search}%`,
            });
          }),
        );
      }
      documents.orderBy('document.createdAt', 'DESC');

      const { items, meta, links } = await paginate<DocumentsView>(
        documents,
        options,
      );
      return {
        message: 'Get all documents successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async countsDocumentByAssetOrArea(
    id: string,
    types: string[],
    isActive: string,
  ): Promise<GetDocumentsViewCountResponseDto> {
    try {
      const documents = this.documentsViewRepository
        .createQueryBuilder('document')
        .where(
          new Brackets((qb) => {
            qb.where('document.assetId =:id', {
              id,
            }).orWhere('document.areaId =:id', {
              id,
            });
          }),
        );
      if (types.length) {
        documents.andWhere('document.type IN(:...types)', { types });
      }
      if (isActive === 'true') {
        documents.andWhere('document.isActive = True');
      } else if (isActive === 'false') {
        documents.andWhere('document.isActive = False');
      }

      return {
        message: 'Get all documents successfully',
        data: { count: await documents.getCount() },
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllDocumentsByAssetOrAreaOrSubProjectOrPM(
    id: string,
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    search: string,
    options: IPaginationOptions,
  ): Promise<GetAllDocumentsResponseDto> {
    try {
      const documents = this.documentsRepository
        .createQueryBuilder('document')
        .leftJoinAndSelect('document.createdBy', 'createdBy')
        .where(
          new Brackets((qb) => {
            qb.where('document.project =:id', {
              id,
            })
              .orWhere('document.preventiveMaintenance =:id', {
                id,
              })
              .orWhere('document.subProject =:id', {
                id,
              })
              .orWhere('document.asset =:id', {
                id,
              })
              .orWhere('document.area =:id', {
                id,
              });
          }),
        );
      if (search) {
        documents.andWhere(
          new Brackets((qb) => {
            qb.where('document.fileName ILIKE :search', {
              search: `%${search}%`,
            })
              .orWhere('document.folder::text ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('createdBy.first_name ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('createdBy.last_name ILIKE :search', {
                search: `%${search}%`,
              });
          }),
        );
      }
      if (orderField && orderBy) {
        documents.addOrderBy(`document.${orderField}`, orderBy);
      } else {
        documents.orderBy('document.created_at', 'DESC');
      }
      const { items, meta, links } = await paginate<Documents>(
        documents,
        options,
      );
      return {
        message: 'Get all documents successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async createOneByPM(
    pm: PreventiveMaintenances,
    user: User,
    file: Express.Multer.File,
    folder: Folders,
  ) {
    try {
      const findUser = await this.usersService.findOneById(user.id);
      const fileUpload = await this.fileUploadService.fileUpload(
        file,
        `procedures/steps`,
        true,
      );
      return await this.documentsRepository.save(
        new Documents({
          folder: folder,
          project: pm.project,
          subProject: pm.subProject,
          fileName: fileUpload.originalname,
          filePath: fileUpload.key,
          fileType: fileUpload.mimetype,
          preventiveMaintenance: pm,
          createdBy: findUser,
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  async create(
    token: string,
    authUser,
    createDocumentDto: CreateDocumentDto,
    files: UploadFilesDto,
  ) {
    try {
      const isExistId =
        createDocumentDto.subProjectId ??
        createDocumentDto.assetId ??
        createDocumentDto.areaId ??
        createDocumentDto.preventiveMaintenanceId;

      const user = await this.usersService.findOneById(authUser.id);
      const project = await this.projectsService.findOneById(
        createDocumentDto.projectId,
      );
      let subProject = null;
      if (createDocumentDto.subProjectId) {
        subProject = await this.projectsService.findOneByIdSubProject(
          createDocumentDto.subProjectId,
        );
      }
      let area = null;
      if (createDocumentDto.areaId) {
        area = await this.areasService.findOneById(createDocumentDto.areaId);
      }
      let asset = null;
      if (createDocumentDto.assetId) {
        asset = await this.assetsService.findOneById(createDocumentDto.assetId);
      }
      let pm = null;
      if (createDocumentDto.preventiveMaintenanceId) {
        pm = await this.pmService.findOneByIdWithoutRelations(
          createDocumentDto.preventiveMaintenanceId,
        );
      }
      const pmDocumentsArray = [];
      const folders = Object.keys(Folders);
      const data = [];
      for (let i = 0; i < folders.length; i++) {
        if (files[folders[i]]?.length > 0) {
          const fileUploaded = await this.fileUploadService.multiFileUpload(
            files[folders[i]],
            `${project.id}/${isExistId}/${folders[i]}`,
            true,
            token,
            user.branch.company.id,
          );
          data.push(fileUploaded[0]);
          for (let x = 0; x < fileUploaded.length; x++) {
            const messageText = CommentsMessages.DOCUMENT_UPLOAD.replace(
              '{folder}',
              enumToTile(Folders[folders[i]]),
            );
            if (pm) {
              await this.commentsService.create({
                referenceId: isExistId,
                subProject: pm.subProject.id,
                sentBy: user.id,
                text: messageText,
                contentType: ContentTypes.ATTACHMENT,
                referenceType: pm.pmType,
                s3Key: fileUploaded[x].key,
                fileName: fileUploaded[x].originalname,
                isSystemGenerated: true,
              });
              await this.pmService.sendTaskUpdateNotificationsQueue(
                pm,
                user,
                messageText,
              );
            }
            pmDocumentsArray.push({
              folder: Folders[folders[i]],
              project: project,
              subProject: subProject,
              fileName: fileUploaded[x].originalname,
              filePath: fileUploaded[x].key,
              fileType: fileUploaded[x].mimetype,
              preventiveMaintenance: pm,
              area: area,
              asset: asset,
              createdBy: user.id,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            });
          }
        }
      }

      const pmDocuments = await this.documentsRepository.insert(
        pmDocumentsArray,
      );
      if (createDocumentDto.preventiveMaintenanceId) {
        await this.pmService.teamMembersFromDjangoAndSendEmailQueue(
          createDocumentDto.preventiveMaintenanceId,
          'UPLOAD',
        );
      }

      return {
        message: 'Preventive maintenance documents uploaded successfully',
        data: data[0],
      };
    } catch (error) {
      throw error;
    }
  }

  async softDelete(
    user: User,
    id: string,
    comment: string,
  ): Promise<BaseResponseDto> {
    try {
      const isExist = await this.documentsRepository.findOneBy({
        id,
      });
      if (!isExist) {
        throw new NotFoundException('Document does not exist');
      }
      user = await this.usersService.findOneById(user.id);
      await this.documentsRepository.save(
        new Documents({
          ...isExist,
          comment,
          isActive: false,
          softDeletedAt: dateToUTC(),
          deletedBy: user,
        }),
      );
      return {
        message: 'Delete document successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async recoverAndUpdate(
    user: User,
    id: string,
    dto: RecoverAndUpdateDocumentDto,
  ): Promise<BaseResponseDto> {
    try {
      const { fileName, recoveredComment, comment } = dto;
      const isExist = await this.documentsRepository.findOneBy({
        id,
      });
      if (!isExist) {
        throw new NotFoundException('Document does not exist');
      }
      user = await this.usersService.findOneById(user.id);
      let dataToUpdate = {};
      if (recoveredComment) {
        dataToUpdate = {
          ...isExist,
          comment: recoveredComment,
          isActive: true,
          deletedBy: null,
          softDeletedAt: null,
          recoveredAt: dateToUTC(),
          deletedComment: null,
          recoveredBy: user,
        };
      } else {
        dataToUpdate = {
          ...isExist,
          fileName,
          comment,
        };
      }
      await this.documentsRepository.save(new Documents(dataToUpdate));
      return {
        message: 'Document updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async softDeleteByFilePath(
    user: User,
    filePath: string,
  ): Promise<BaseResponseDto> {
    try {
      const isExist = await this.documentsRepository.findOneBy({
        filePath,
      });
      if (!isExist) {
        throw new NotFoundException('Document does not exist');
      }
      user = await this.usersService.findOneById(user.id);
      await Promise.all([
        // this.fileUploadService.fileDelete(isExist.filePath),
        this.documentsRepository.save(
          new Documents({
            ...isExist,
            isActive: false,
            softDeletedAt: dateToUTC(),
            deletedBy: user,
          }),
        ),
      ]);
      return {
        message: 'Delete document successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(referenceIds: string[]): Promise<BaseResponseDto> {
    try {
      const findDocuments = await this.documentsRepository.find({
        where: [
          {
            subProject: In(referenceIds),
          },
          {
            area: In(referenceIds),
          },
          {
            asset: In(referenceIds),
          },
          {
            preventiveMaintenance: In(referenceIds),
          },
        ],
      });
      await this.fileUploadService.multiFilesDelete(
        findDocuments.map(({ filePath }) => filePath),
      );
      await this.documentsRepository.delete({
        id: In(findDocuments.map((d) => d.id)),
      });
      return {
        message: 'Documents delete to preventive maintenance',
      };
    } catch (error) {
      throw error;
    }
  }

  async getCount(projectIds: string[]): Promise<number> {
    const distinctCount = await this.documentsViewRepository
      .createQueryBuilder('document')
      .where('document.subProjectId IN (:...projectIds)', { projectIds })
      .andWhere('document.isActive = :isActive', { isActive: true })
      .select('COUNT(DISTINCT document.filePath)', 'count')
      .getRawOne();
    return +distinctCount.count;
  }
}
