import { BaseResponseDto } from '@common/dto/base-response.dto';
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Queue } from 'bull';
import { Brackets, In } from 'typeorm';
import { FilesUploadService } from '../files-upload/files-upload.service';
import { PreventiveMaintenancesService } from '../preventive-maintenances/preventive-maintenances.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import {
  CreatePreventiveMaintenanceDocumentDto,
  DocumentUploadedFromEnum,
} from './dto/create-preventive-maintenance-document.dto';
import { UploadFilesDto } from './dto/upload-preventive-maintenance-document.dto';
import { Folders } from './models/folders.enum';
import { PreventiveMaintenanceDocumentsRepository } from './repositories/preventive-maintenance-documents.repository';
import { ProjectsService } from 'modules/projects/projects.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PreventiveMaintenanceDocuments } from './entities/preventive-maintenance-documents.entity';
import { CommentsMessages } from 'modules/comments/models/comments-messages';
import { ContentTypes } from 'modules/comments/models/content-types';
import { CommentsService } from 'modules/comments/comments.service';
import { PreventiveMaintenances } from 'modules/preventive-maintenances/entities/preventive-maintenances.entity';
import { dateToUTC, enumToTile } from '@common/utils/utils';
import { RecoverAndUpdatePreventiveMaintenanceDocumentDto } from './dto/recover-preventive-maintenance-document.dto';
import { AIService } from 'modules/ai/ai-service';
import { InjectQueue } from '@nestjs/bull';
import * as path from 'path';

@Injectable()
export class PreventiveMaintenanceDocumentsService {
  constructor(
    private pmDocumentsRepository: PreventiveMaintenanceDocumentsRepository,
    @Inject(forwardRef(() => PreventiveMaintenancesService))
    private pmService: PreventiveMaintenancesService,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private commentsService: CommentsService,
    private readonly fileUploadService: FilesUploadService,
    private aiService: AIService,
    @InjectQueue('preventiveMaintenanceDocuments')
    private preventiveMaintenanceDocumentsQueue: Queue,
  ) {}

  async createOne(
    pm: PreventiveMaintenances,
    user: User,
    file: Express.Multer.File,
    folder: Folders,
    token: string,
  ) {
    try {
      const findUser = await this.usersService.findOneById(user.id);
      const fileUpload = await this.fileUploadService.fileUpload(
        file,
        `procedures/steps`,
        true,
        token,
        findUser.branch.company.id,
      );
      return await this.pmDocumentsRepository.save(
        new PreventiveMaintenanceDocuments({
          folder: folder,
          project: pm.project,
          subProject: pm.subProject,
          fileName: fileUpload.originalname,
          filePath: fileUpload.key,
          fileType: fileUpload.mimetype,
          preventiveMaintenance: pm,
          uploadedBy: findUser,
          createdAt: dateToUTC(),
          updatedAt: dateToUTC(),
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  async insertMany(data) {
    try {
      return await this.pmDocumentsRepository.insert(data);
    } catch (error) {
      throw error;
    }
  }

  async deleteFilesByIds(user, ids) {
    try {
      await this.pmDocumentsRepository.update(
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
        message: 'Master preventive maintenance files deleted',
        data: {},
      };
    } catch (error) {
      throw error;
    }
  }

  async create(
    token: string,
    user,
    pmId: string,
    createPmDocumentDto: CreatePreventiveMaintenanceDocumentDto,
    files: UploadFilesDto,
  ) {
    try {
      const isExist = await this.pmService.findOneByIdWithoutRelations(pmId);
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      const [user, project, subProject] = await Promise.all([
        this.usersService.findOneById(createPmDocumentDto.userId),
        this.projectsService.findOneById(createPmDocumentDto.projectId),
        this.projectsService.findOneByIdSubProject(
          createPmDocumentDto.subProjectId,
        ),
      ]);
      const pmDocumentsArray = [];

      const folders = Object.keys(Folders);
      const data = [];
      const filesContent = [];
      for (let i = 0; i < folders.length; i++) {
        if (files[folders[i]]?.length > 0) {
          const fileUploaded = await this.fileUploadService.multiFileUpload(
            files[folders[i]],
            `${subProject.id}/${pmId}/${folders[i]}`,
            true,
            token,
            user.branch.company.id,
          );
          for (let x = 0; x < fileUploaded.length; x++) {
            const messageText = CommentsMessages.DOCUMENT_UPLOAD.replace(
              '{folder}',
              enumToTile(Folders[folders[i]]),
            );
            let comment = null;
            if (
              createPmDocumentDto?.from !==
              DocumentUploadedFromEnum.MESSAGING_CENTER
            ) {
              comment = await this.commentsService.create({
                referenceId: isExist.id,
                subProject: isExist.subProject.id,
                sentBy: user.id,
                text: messageText,
                contentType: ContentTypes.ATTACHMENT,
                referenceType: isExist.pmType,
                s3Key: fileUploaded[x].key,
                fileName: fileUploaded[x].originalname,
                isSystemGenerated: true,
              });
              await this.pmService.sendTaskUpdateNotificationsQueue(
                isExist,
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
              preventiveMaintenance: isExist.id,
              uploadedBy: user.id,
              createdAt: dateToUTC(),
              updatedAt: dateToUTC(),
            });

            // Handle speech-to-text only for audio files
            filesContent.push({
              filePath: fileUploaded[x].key,
              fileFormat: path.extname(fileUploaded[x].originalname),
              fileType: fileUploaded[x].mimetype,
              comment,
              s3Key: fileUploaded[x].key,
            });
            data.push(fileUploaded[x]);
          }
        }
      }

      const pmDocuments = await this.pmDocumentsRepository.insert(
        pmDocumentsArray,
      );
      await Promise.all([
        this.preventiveMaintenanceDocumentsQueue.add('transcribeAudio', {
          pmDocumentIds: pmDocuments.identifiers,
          pmDocuments: filesContent,
        }),
        this.pmService.teamMembersFromDjangoAndSendEmailQueue(pmId, 'UPLOAD'),
      ]);

      return {
        message: 'Preventive maintenance documents uploaded successfully',
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  async transcribeAudio(pmDocumentIds, pmDocuments) {
    // pmDocuments
    for (let i = 0; i < pmDocuments.length; i++) {
      if (pmDocuments[i].fileType.startsWith('audio')) {
        // Call transcription service and save result
        const speechTranscript = await this.aiService.transcribeAudio(
          pmDocuments[i].filePath,
          pmDocuments[i].fileFormat,
        );

        // save record in db
        await this.pmDocumentsRepository.update(
          { id: pmDocumentIds[i].id },
          { speechTranscript: speechTranscript },
        );
        if (pmDocuments[i].comment) {
          await this.commentsService.commentUpdate(
            { id: pmDocuments[i].comment.data.id },
            { speechTranscript: speechTranscript },
          );
        }
        if (!pmDocuments[i].comment && pmDocuments[i].s3Key) {
          await this.commentsService.commentUpdate(
            { s3Key: pmDocuments[i].s3Key },
            { speechTranscript: speechTranscript },
          );
        }
      }
    }
  }

  async findByPmId(
    pmId: string,
    folder: Folders,
    search: string,
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    fileType: string,
    signedUrls: boolean,
    options: IPaginationOptions,
  ) {
    try {
      // Set the static flag to enable/disable signed URL generation
      PreventiveMaintenanceDocuments.setSignUrls(signedUrls);
      const pmDocuments = this.pmDocumentsRepository
        .createQueryBuilder('pmd')
        .where('pmd.preventiveMaintenance = :pmId', { pmId })
        .leftJoinAndSelect('pmd.uploadedBy', 'uploadedBy');
      if (folder) {
        pmDocuments.andWhere('pmd.folder = :folder', {
          folder,
        });
      }
      if (!folder) {
        pmDocuments.andWhere(`pmd.folder != '${Folders.ACTIVITY}'`); // messagimg center files should not be show
      }
      if (fileType === 'media') {
        const mediaPatterns = ['image/', 'video/'];
        const query = mediaPatterns
          .map((pattern) => `pmd.file_type ILIKE '%${pattern}%'`)
          .join(' OR ');
        pmDocuments.andWhere(`(${query})`);
      }
      if (search) {
        pmDocuments.andWhere(
          new Brackets((qb) => {
            qb.where('pmd.fileName ILIKE :search', {
              search: `%${search}%`,
            })
              .orWhere('pmd.folder::text ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('uploadedBy.first_name ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('uploadedBy.last_name ILIKE :search', {
                search: `%${search}%`,
              });
          }),
        );
      }
      if (orderField && orderBy) {
        pmDocuments.addOrderBy(`pmd.${orderField}`, orderBy);
      } else {
        pmDocuments.orderBy('pmd.created_at', 'DESC');
      }
      const { items, meta, links } =
        await paginate<PreventiveMaintenanceDocuments>(pmDocuments, options);
      return {
        message: 'Get all preventive maintenances successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async softDelete(
    user: User,
    id: string,
    deletedComment: string,
  ): Promise<BaseResponseDto> {
    try {
      const isExist = await this.pmDocumentsRepository.findOneBy({
        id,
      });
      if (!isExist) {
        throw new NotFoundException(
          'Preventive maintenance document does not exist',
        );
      }

      user = await this.usersService.findOneById(user.id);
      await Promise.all([
        // this.fileUploadService.fileDelete(isExist.filePath),
        this.pmDocumentsRepository.save(
          new PreventiveMaintenanceDocuments({
            ...isExist,
            comment: deletedComment,
            isActive: false,
            softDeletedAt: dateToUTC(),
            deletedBy: user,
          }),
        ),
      ]);

      return {
        message: 'Documents delete to preventive maintenance',
      };
    } catch (error) {
      throw error;
    }
  }

  async recoverAndUpdate(
    user: User,
    id: string,
    dto: RecoverAndUpdatePreventiveMaintenanceDocumentDto,
  ): Promise<BaseResponseDto> {
    try {
      const { fileName, recoveredComment, comment } = dto;
      const isExist = await this.pmDocumentsRepository.findOneBy({
        id,
      });
      if (!isExist) {
        throw new NotFoundException(
          'Preventive maintenance document does not exist',
        );
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
      await this.pmDocumentsRepository.save(
        new PreventiveMaintenanceDocuments(dataToUpdate),
      );
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
      const isExist = await this.pmDocumentsRepository.findOneBy({
        filePath,
      });
      if (!isExist) {
        throw new NotFoundException(
          'Preventive maintenance document does not exist',
        );
      }
      user = await this.usersService.findOneById(user.id);
      await Promise.all([
        // this.fileUploadService.fileDelete(isExist.filePath),
        this.pmDocumentsRepository.save(
          new PreventiveMaintenanceDocuments({
            ...isExist,
            isActive: false,
            softDeletedAt: dateToUTC(),
            deletedBy: user,
          }),
        ),
      ]);
      return {
        message: 'Documents delete to preventive maintenance',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(pmIds: string[]): Promise<BaseResponseDto> {
    try {
      const findDocuments = await this.pmDocumentsRepository.find({
        where: {
          preventiveMaintenance: In(pmIds),
        },
      });
      await this.fileUploadService.multiFilesDelete(
        findDocuments.map(({ filePath }) => filePath),
      );
      await this.pmDocumentsRepository.delete({
        preventiveMaintenance: In(pmIds),
      });
      return {
        message: 'Documents delete to preventive maintenance',
      };
    } catch (error) {
      throw error;
    }
  }
}
