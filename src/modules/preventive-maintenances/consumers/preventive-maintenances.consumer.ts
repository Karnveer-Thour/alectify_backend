import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { PreventiveMaintenancesService } from '../preventive-maintenances.service';

@Processor('preventiveMaintenances')
export class PreventiveMaintenancesConsumer {
  constructor(
    private readonly preventiveMaintenancesService: PreventiveMaintenancesService,
  ) {}

  @Process('createOneYearPMs')
  async createOneYearPMs(job: Job) {
    try {
      // creating createOneYearPMs
      await this.preventiveMaintenancesService.createOneYearPMs(
        job.data.pm,
        job.data.masterPm,
        job.data.assigneeUsers,
        job.data.approverUsers,
        job.data.teamMemberUsers,
        job.data.procedure,
        job.data.assetIds,
        job.data.areaIds,
        job.data.existingPm,
      );
    } catch (error) {
      console.log('error when creating createOneYearPMs: ', error);
    }
    return { done: true };
  }
  @Process({ name: 'openNewPmAndTask', concurrency: 5 })
  async openNewPmAndTask(job: Job) {
    try {
      // sendTaskUpdateNotifications
      await this.preventiveMaintenancesService.openNewPmAndTask(
        job.data.pm,
        job.data.newOpen,
      );
    } catch (error) {
      console.log('error when sendTaskUpdateNotifications: ', error);
    }
    return { done: true };
  }

  @Process({ name: 'sendTaskUpdateNotifications', concurrency: 5 })
  async sendTaskUpdateNotifications(job: Job) {
    try {
      // sendTaskUpdateNotifications
      await this.preventiveMaintenancesService.sendTaskUpdateNotifications(
        job.data.pm,
        job.data.user,
        job.data.messageText,
      );
    } catch (error) {
      console.log('error when sendTaskUpdateNotifications: ', error);
    }
    return { done: true };
  }
  @Process({ name: 'teamMembersFromDjangoAndSendEmail', concurrency: 5 })
  async teamMembersFromDjangoAndSendEmail(job: Job) {
    try {
      // teamMembersFromDjangoAndSendEmail
      await this.preventiveMaintenancesService.teamMembersFromDjangoAndSendEmail(
        job.data.pmId,
        job.data.requestType,
      );
    } catch (error) {
      console.log('error when teamMembersFromDjangoAndSendEmail: ', error);
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
