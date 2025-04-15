import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { UsersModule } from 'modules/users/users.module';
import { NotificationConsumer } from './consumers/notification.consumer';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './repositories/notifications.repository';
import { UserNotificationsRepository } from './repositories/user-notifications.repository';

@Module({
  imports: [
    UsersModule,
    BullModule.registerQueue({
      name: 'notification',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    UserNotificationsRepository,
    NotificationConsumer,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
