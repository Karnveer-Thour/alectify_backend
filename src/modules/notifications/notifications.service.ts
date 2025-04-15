import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as admin from 'firebase-admin';
import { PreventiveMaintenances } from 'modules/preventive-maintenances/entities/preventive-maintenances.entity';
import { User } from 'modules/users/entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import {
  GetAllNotificationsResponseDto,
  GetNotificationsResponseDto,
  GetUnreadNotificationsCountsResponseDto,
} from './dto/get-notifications.dto';
import { MarkNotificationAsReadDto } from './dto/mark-notifications-as-read.dto';
import { MarkNotificationAsReadResponseDto } from './dto/mark-notifications-as-read-response.dto';
import { In } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { UserNotification } from './entities/user-notification.entity';
import { NotificationsRepository } from './repositories/notifications.repository';
import { UserNotificationsRepository } from './repositories/user-notifications.repository';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { dateToUTC } from '@common/utils/utils';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notification') private notificationQueue: Queue,
    private notificationRepository: NotificationsRepository,
    private userNotificationRepository: UserNotificationsRepository,
  ) {}

  async createNotification(
    notificationDto: Partial<Notification>,
    users: User[],
  ) {
    try {
      await this.notificationQueue.add(
        'dbNotification',
        { notificationDto, users },
        { priority: 1 },
      );
    } catch (error) {
      console.log('error when creating notifications: ', error);
    }
  }

  async sendNotificationToOneDevice(token: string, body: string, data?: any) {
    await admin.messaging().send({
      token,
      data,
      notification: {
        body,
        title: 'Alectify Inc',
        imageUrl: 'https://stage.alectify.com/favicon.ico',
      },
      android: {
        priority: 'high',
      },
      apns: {
        headers: {
          'apns-priority': '5',
        },
      },
      webpush: {
        headers: {
          Urgency: 'high',
        },
      },
    });
  }

  async sendNotificationToMultipleDevices(
    tokens: string[],
    body: string,
    data?: any,
  ) {
    try {
      await this.notificationQueue.add(
        'pushNotification',
        { tokens, body, data },
        { priority: 2 },
      );
    } catch (error) {
      console.log('error in sendNotificationToMultipleDevices: ', error);
    }
  }

  async createPmNotification(
    pm: PreventiveMaintenances,
    message: string,
    userId: string,
    isSystemGenerated: boolean,
    teamMembers: User[],
  ) {
    try {
      const notification: Partial<Notification> = {
        notificationType: pm.pmType as any,
        subProject: pm.subProject.id as any,
        id: randomUUID(),
        message: message,
        createdBy: userId as any,
        asset: pm?.asset?.id as any,
        area: pm?.area?.id as any,
        preventiveMaintenance: pm.id as any,
        isSystemGenerated,
        createdAt: dateToUTC(),
      };
      await this.createNotification(notification, teamMembers);
    } catch (error) {
      console.log('error in createPmNotification: ', error);
    }
  }

  async getNotifications(
    user: User,
    isSystemGenerated: boolean,
    options: IPaginationOptions,
  ): Promise<GetNotificationsResponseDto> {
    const notifications = this.userNotificationRepository
      .createQueryBuilder('userNotification')
      .where('userNotification.user_id = :userId', {
        userId: user.id,
      })
      .leftJoinAndSelect('userNotification.notification', 'notification')
      .leftJoinAndSelect('notification.preventiveMaintenance', 'pm')
      .leftJoinAndSelect('pm.project', 'masterProject')
      .leftJoinAndSelect('pm.subProject', 'subProject')
      .leftJoinAndSelect('pm.area', 'area')
      .leftJoinAndSelect('pm.asset', 'asset')
      .leftJoinAndSelect('notification.createdBy', 'createdBy')
      .leftJoinAndSelect('notification.projectSparePart', 'projectSparePart')
      .leftJoinAndSelect('userNotification.user', 'user');
    if (isSystemGenerated) {
      notifications.andWhere(
        'notification.isSystemGenerated = :isSystemGenerated',
        {
          isSystemGenerated,
        },
      );
    }
    notifications
      .select([
        'userNotification',
        'notification',
        'masterProject.id',
        'masterProject.name',
        'masterProject.description',
        'asset.id',
        'asset.name',
        'area.id',
        'area.name',
        'subProject.id',
        'subProject.name',
        'subProject.description',
        'projectSparePart',
        'user.first_name',
        'user.last_name',
        'user.user_type',
        'user.image_url',
        'createdBy.first_name',
        'createdBy.last_name',
        'createdBy.user_type',
        'createdBy.image_url',
        'pm.id',
        'pm.pmType',
        'pm.workTitle',
        'pm.workId',
        'pm.isGeneric',
      ])
      .orderBy(
        'CASE WHEN userNotification.isRead = false THEN 0 ELSE 1 END',
        'ASC',
      )
      .addOrderBy('userNotification.createdAt', 'DESC');

    const { items, meta, links } = await paginate<UserNotification>(
      notifications,
      options,
    );
    return {
      message: 'Get all notifications successfully',
      data: items,
      links,
      meta: meta,
    };
  }

  async getNotificationsByDate(
    startDate: string,
    endDate: string,
  ): Promise<GetNotificationsResponseDto> {
    try {
      const notifications = this.userNotificationRepository
        .createQueryBuilder('userNotifications')
        .leftJoinAndSelect('userNotifications.notification', 'notification')
        .leftJoinAndSelect('userNotifications.user', 'user')
        .leftJoinAndSelect('notification.preventiveMaintenance', 'pm')
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        .leftJoinAndSelect('pm.area', 'area')
        .leftJoinAndSelect('pm.asset', 'asset')
        .leftJoinAndSelect('notification.createdBy', 'createdBy')
        .leftJoinAndSelect('notification.projectSparePart', 'projectSparePart')
        .where('notification.createdAt >=:startDate', {
          startDate: `${startDate} 00:00:00`,
        })
        .andWhere('notification.createdAt <=:endDate', {
          endDate: `${endDate} 24:00:00`,
        });

      return {
        message: 'Get all notifications successfully',
        data: await notifications
          .orderBy('notification.createdAt', 'DESC')
          .getMany(),
      };
    } catch (error) {
      throw error;
    }
  }

  async getUnreadCounts(
    user: User,
  ): Promise<GetUnreadNotificationsCountsResponseDto> {
    const [unRead, unReadSystemGenerated] = await Promise.all([
      await this.userNotificationRepository.count({
        relations: ['notification'],
        where: {
          user: { id: user.id },
          isRead: false,
          notification: {
            isSystemGenerated: false,
          },
        },
      }),
      await this.userNotificationRepository.count({
        relations: ['notification'],
        where: {
          user: { id: user.id },
          isRead: false,
          notification: {
            isSystemGenerated: true,
          },
        },
      }),
    ]);

    return {
      message: 'Get all unread notifications count successfully',
      data: {
        unRead: unRead || 0,
        unReadSystemGenerated: unReadSystemGenerated || 0,
      },
    };
  }

  async markAsRead(
    user: User,
    body: MarkNotificationAsReadDto,
  ): Promise<MarkNotificationAsReadResponseDto> {
    try {
      const query = this.userNotificationRepository
        .createQueryBuilder('userNotification')
        .leftJoinAndSelect('userNotification.notification', 'notification')
        .where('userNotification.isRead = False')
        .andWhere('userNotification.user_id = :userId', { userId: user.id });

      if (body.ids.length > 0) {
        query.andWhere('userNotification.id IN (:...ids)', { ids: body.ids });
      }

      if (body.isSystemGenerated === false || body.isSystemGenerated === true) {
        query.andWhere('notification.isSystemGenerated = :isSystemGenerated', {
          isSystemGenerated: body.isSystemGenerated,
        });
      }
      const ids = (await query.select(['userNotification.id']).getMany()).map(
        ({ id }) => id,
      );
      await this.userNotificationRepository.update(
        {
          id: In(ids),
        },
        {
          isRead: true,
        },
      );

      return {
        data: body.ids,
        message: 'Notifications marked as read successfully.',
      };
    } catch (error) {}
  }

  async deleteNotificationByPmId(pmIds) {
    try {
      const notifications = await this.notificationRepository.findBy({
        preventiveMaintenance: In(pmIds),
      });
      await this.userNotificationRepository.delete({
        notification: In(notifications.map(({ id }) => id)),
      });
      await this.notificationRepository.delete({
        preventiveMaintenance: In(pmIds),
      });
      return {
        message: 'Notifications deleted successfully',
      };
    } catch (error) {
      console.log('error when delete notifications: ', error);
    }
  }
}
