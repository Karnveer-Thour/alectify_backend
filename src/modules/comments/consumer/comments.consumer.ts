import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { CommentsService } from '../comments.service';

@Processor('comments')
export class PreventiveMaintenancesConsumer {
  constructor(private readonly commentsService: CommentsService) {}

  @Process({ name: 'saveCommentNotification', concurrency: 5 })
  async saveCommentNotification(job: Job) {
    try {
      // creating createOneYearPMs
      await this.commentsService.saveCommentNotification(
        job.data.pmId,
        job.data.message,
        job.data.userId,
      );
    } catch (error) {
      console.log('error when creating saveCommentNotification: ', error);
    }
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
