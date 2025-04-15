import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { PreventiveMaintenancesService } from '../preventive-maintenances.service';

@Processor('preventiveMaintenanceGpt')
export class PreventiveMaintenanceGptConsumer {
  constructor(
    private readonly preventiveMaintenancesService: PreventiveMaintenancesService,
  ) {}

  @Process({ name: 'chatGptRequest', concurrency: 5 })
  async chatGptRequest(job: Job) {
    try {
      // call chat gpt
      await this.preventiveMaintenancesService.chatGptRequest(job.data.id);
    } catch (error) {
      console.log('error when creating chatGptRequest: ', error);
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
