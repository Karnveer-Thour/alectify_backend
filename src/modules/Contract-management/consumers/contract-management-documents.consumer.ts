import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { ContractManagementDocumentService } from '../contract-management-document.service';

@Processor('masterPreventiveMaintenanceDocuments')
export class MasterPreventiveMaintenanceDocumentsConsumer {
  constructor(
    private ContractManagementDocumentService:ContractManagementDocumentService,
  ) {}

  @Process('uploadFilesAndImagesForCM')
  async uploadFilesAndImagesForPM(job: Job) {
    try {
      if (job.data.documents) {
        if (job.data.documents['images']?.length) {
          job.data.documents['images'] = job.data.documents['images'].map(
            (img) => ({ ...img, buffer: Buffer.from(img.buffer) }),
          );
        }
        if (job.data.documents['files']?.length) {
          job.data.documents['files'] = job.data.documents['files'].map(
            (file) => ({ ...file, buffer: Buffer.from(file.buffer) }),
          );
        }
      }

      // creating createOneYearCMs
      await this.ContractManagementDocumentService.uploadImagesForCM(
        job.data.documents,
        job.data.user,
        job.data.token,
        job.data.cmDto,
      );

    } catch (error) {
      console.log('error when creating createOneYearCMs: ', error);
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
