import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { PreventiveMaintenanceDocumentsService } from '../preventive-maintenance-documents.service';

@Processor('preventiveMaintenanceDocuments')
export class PreventiveMaintenanceDocumentsConsumer {
  constructor(
    private readonly preventiveMaintenanceDocumentsService: PreventiveMaintenanceDocumentsService,
  ) {}

  @Process({ name: 'transcribeAudio', concurrency: 5 })
  async transcribeAudio(job: Job) {
    try {
      // call transcribeAudio
      await this.preventiveMaintenanceDocumentsService.transcribeAudio(
        job.data.pmDocumentIds,
        job.data.pmDocuments,
      );
    } catch (error) {
      console.log('error when creating transcribeAudio: ', error);
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
