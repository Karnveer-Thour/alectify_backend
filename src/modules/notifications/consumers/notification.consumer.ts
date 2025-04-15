import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { randomUUID } from 'crypto';
import * as admin from 'firebase-admin';
import { User } from 'modules/users/entities/user.entity';
import { UserFcmTokenService } from 'modules/users/services/user-fcm-token.service';
import { Notification } from '../entities/notification.entity';
import { UserNotification } from '../entities/user-notification.entity';
import { NotificationsService } from '../notifications.service';
import { NotificationsRepository } from '../repositories/notifications.repository';
import { UserNotificationsRepository } from '../repositories/user-notifications.repository';
import { dateToUTC } from '@common/utils/utils';

@Processor('notification')
export class NotificationConsumer {
  constructor(
    private notificationService: NotificationsService,
    private notificationRepository: NotificationsRepository,
    private userNotificationRepository: UserNotificationsRepository,
    private userFcmTokenService: UserFcmTokenService,
  ) {}

  @Process({ name: 'dbNotification', concurrency: 5 })
  async dbNotification(
    job: Job<{ notificationDto: Notification; users: User[] }>,
  ) {
    try {
      // saving notification
      const notification = await this.notificationRepository.save(
        new Notification(job.data.notificationDto),
      );
      // mapping users with associated notification
      const notificationUsers = job.data.users.map(
        (user) =>
          new UserNotification({
            id: randomUUID(),
            isRead: false,
            user: user.id as any,
            notification: notification.id as any,
            createdAt: dateToUTC(),
          }),
      );
      //   saving users with associated notification
      await this.userNotificationRepository.save(notificationUsers);
    } catch (error) {
      console.log('error when saving dbNotification: ', error);
    }
    return { done: true };
  }

  @Process({ name: 'pushNotification', concurrency: 5 })
  async pushNotification(
    job: Job<{ tokens: string[]; body: string; data: any }>,
  ) {
    const { tokens, body, data } = job.data;
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      data: data ?? {},
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

    if (response.failureCount > 0) {
      const failedTokens = []; // unused or unregistered tokens
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
      await this.userFcmTokenService.deleteFcmTokens(failedTokens);
    }
    job.finished();
    return { done: true };
  }

  @OnQueueActive()
  onActive(job: Job<unknown>) {
    console.log(`Starting job ${job.id}: ${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job<unknown>) {
    console.log(`Job ${job.id}: ${job.name} has been finished`);
  }
}
