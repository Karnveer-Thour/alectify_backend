import { randomUUID } from 'crypto';
import { truncate } from 'lodash';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import {
  CreateCommentForAPIDto,
  CreateCommentsDto,
} from './dto/create-comments.dto';
import { CommentsRepository } from './repositories/comments.repository';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { PreventiveMaintenances } from '../preventive-maintenances/entities/preventive-maintenances.entity';
import { GetAllCommentsResponseDto } from './dto/get-all-comments.dto';
import {
  CreateCommentDjangoResponseDto,
  CreateCommentResponseDto,
} from './dto/create-comment-response.dto';
import { CreateCommentParamsDto } from './dto/create-comment-params.dto';
import { mapCommentsToDjangoResponse } from './helpers/comments.mapper';
import { NotificationsService } from 'modules/notifications/notifications.service';
import { PreventiveMaintenancesService } from 'modules/preventive-maintenances/preventive-maintenances.service';
import { UserFcmTokenService } from 'modules/users/services/user-fcm-token.service';
import { UsersService } from 'modules/users/users.service';
import { dateToUTC, enumToTile } from '@common/utils/utils';
import { CommentsMessages } from './models/comments-messages';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { In } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private projectService: ProjectsService,
    private notificationService: NotificationsService,
    @Inject(forwardRef(() => PreventiveMaintenancesService))
    private pmService: PreventiveMaintenancesService,
    private userFcmTokenService: UserFcmTokenService,
    private userService: UsersService,
    @InjectQueue('comments')
    private readonly commentsQueue: Queue,
  ) {}
  async create(
    createCommentsDto: CreateCommentsDto,
  ): Promise<CreateCommentResponseDto> {
    try {
      const newComment = await this.commentsRepository.save(
        new Comment({
          ...(createCommentsDto as any),
          id: randomUUID(),
          isActive: 1,
          createdAt: dateToUTC(),
          updatedAt: dateToUTC(),
        }),
      );
      return {
        message: 'Comment created successfully',
        data: newComment,
      };
    } catch (error) {
      throw error;
    }
  }

  async createComment(
    params: CreateCommentParamsDto,
    createCommentsDto: CreateCommentForAPIDto,
    authToken: string,
  ): Promise<CreateCommentDjangoResponseDto> {
    try {
      let commentsToSave;
      if (
        Array.isArray(createCommentsDto.s3_key) &&
        Array.isArray(createCommentsDto.file_name) &&
        createCommentsDto.s3_key.length > 0 &&
        createCommentsDto.file_name.length > 0
      ) {
        commentsToSave = createCommentsDto.s3_key.map((s3, index) => {
          return new Comment({
            contentType: createCommentsDto.content_type,
            text: index === 0 ? createCommentsDto.text : null,
            s3Key: s3,
            sentBy: createCommentsDto.sent_by as any,
            subProject: params.subProjectId as any,
            fileName: createCommentsDto.file_name[index],
            referenceType: createCommentsDto.reference_type,
            referenceId: params.referenceId as any,
            id: randomUUID(),
            isActive: 1,
            isSystemGenerated: false,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          });
        });
      } else {
        commentsToSave = [
          new Comment({
            contentType: createCommentsDto.content_type,
            text: createCommentsDto.text,
            s3Key: createCommentsDto.s3_key as any,
            sentBy: createCommentsDto.sent_by as any,
            subProject: params.subProjectId as any,
            fileName: createCommentsDto.file_name as any,
            referenceType: createCommentsDto.reference_type,
            referenceId: params.referenceId as any,
            id: randomUUID(),
            isActive: 1,
            isSystemGenerated: false,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          }),
        ];
      }
      // Save comments in bulk if possible
      const savedComments = await this.commentsRepository.save(commentsToSave);

      // Fetch the saved comments with related data (if needed)
      const [newComments] = await Promise.all([
        Promise.all(
          savedComments.map((comment) => this.getCommentById(comment.id)),
        ),
        Promise.all(
          savedComments.map((comnt) =>
            this.commentsQueue.add('saveCommentNotification', {
              pmId: params.referenceId,
              message: comnt.text,
              userId: comnt.sentBy,
            }),
          ),
        ),
      ]);

      return {
        message: 'Comment created successfully',
        data: newComments.map((cmt) => mapCommentsToDjangoResponse(cmt)),
      };
    } catch (error) {
      console.error('Error creating comments:', error);
      throw new Error('Failed to create comments');
    }
  }

  async getCommentById(id: string): Promise<Comment> {
    return this.commentsRepository.findOne({
      where: { id },
      relations: ['sentBy', 'subProject'],
    });
  }

  async getCommentByIds(ids: string[]): Promise<Comment> {
    return this.commentsRepository.findOne({
      where: { id: In(ids) },
      relations: ['sentBy', 'subProject'],
    });
  }

  async getCompleteTimeline(
    user: User,
    options: IPaginationOptions,
  ): Promise<GetAllCommentsResponseDto> {
    try {
      options.page = Number(options.page);
      options.limit = Number(options.limit);
      const subProjects =
        await this.projectService.findProjectsAndSubProjectByUserId(user.id);
      const subProjectIds = subProjects
        .map(({ project }) =>
          project.subProjects.map((subProject) => subProject.id),
        )
        .flat(1);
      const comments = await this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.subProject', 'subProject')
        .where('subProject.id IN (:...subProjectIds)', {
          subProjectIds,
        })
        .andWhere('comment.isSystemGenerated = True')
        .leftJoinAndSelect('comment.sentBy', 'sentBy')
        .select([
          'comment',
          'sentBy.first_name',
          'sentBy.last_name',
          'sentBy.user_type',
          'sentBy.image_url',
          'comment.referenceId AS pm',
        ])
        .leftJoinAndMapOne(
          'comment.pm',
          PreventiveMaintenances,
          'pm',
          `comment."reference_id"::text = pm.id::text`,
        )
        .orderBy('comment.createdAt', 'DESC');

      const { items, meta, links } = await paginate<Comment>(comments, options);
      return {
        message: 'Get all comments successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async saveCommentNotification(pmId: string, message: string, userId: string) {
    try {
      const [user, pm] = await Promise.all([
        this.userService.findOneById(userId),
        this.pmService.findOneWithAssignees(pmId),
      ]);

      const teamMembers =
        await this.pmService.getTeamMembersWithExternalAssignees(pm);
      if (!teamMembers?.length) return;

      const teamMemberIds = teamMembers.map(({ id }) => id);

      const deviceIds = await this.userFcmTokenService.findFcmTokensByUserIds(
        teamMemberIds,
      );
      const { pmType, workId, workTitle, area, asset } = pm;

      if (!deviceIds?.length) return;

      const messageText = CommentsMessages.MESSAGE.replace(
        '{message}',
        message,
      );
      const requestUser = `${user.first_name} ${user.last_name}`;
      const notificationMessage = `${requestUser} ${messageText}`;

      const notification = {
        workId,
        workTitle,
        type: pmType,
        areaId: area?.id || '',
        assetId: asset?.id || '',
        assetName: asset?.name || '',
        assetPackageName: area?.name || '',
        userId,
      };

      await Promise.all([
        this.notificationService.createPmNotification(
          // saving notifications in the db
          pm,
          messageText,
          userId,
          false,
          teamMembers,
        ),
        this.notificationService.sendNotificationToMultipleDevices(
          // sending push notifications to the devices
          deviceIds,
          notificationMessage,
          notification,
        ),
      ]);
    } catch (error) {
      console.log('error: ', error);
    }
  }

  async getCommentsByReferenceId(
    referenceId: string,
  ): Promise<GetAllCommentsResponseDto> {
    try {
      const comments = await this.commentsRepository
        .createQueryBuilder('comment')
        .where('comment.reference_id = :referenceId', {
          referenceId,
        })
        .leftJoinAndSelect('comment.sentBy', 'sentBy')
        .select([
          'comment',
          'sentBy.first_name',
          'sentBy.last_name',
          'sentBy.user_type',
          'sentBy.image_url',
          'comment.referenceId AS pm',
        ])
        .leftJoinAndMapOne(
          'comment.pm',
          PreventiveMaintenances,
          'pm',
          `comment."reference_id"::text = pm.id::text`,
        )
        .orderBy('comment.createdAt', 'DESC')
        .getMany();
      return {
        message: 'Get Comments successfully',
        data: comments,
      };
    } catch (error) {
      throw error;
    }
  }

  async commentUpdate(condition, body) {
    return await this.commentsRepository.update(condition, body);
  }
}
