import { forwardRef, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UsersModule } from 'modules/users/users.module';
import { ProjectsModule } from 'modules/projects/projects.module';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { PreventiveMaintenancesModule } from 'modules/preventive-maintenances/preventive-maintenances.module';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './repositories/comments.repository';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'comments',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
    ProjectsModule,
    forwardRef(() => PreventiveMaintenancesModule),
    NotificationsModule,
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
