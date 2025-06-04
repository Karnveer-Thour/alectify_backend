import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { ContractManagementDocumentService } from '../contract-management-document.service';

@Processor('contractManagementDocuments')
export class contractManagementDocumentsConsumer {
  constructor(
    private ContractManagementDocumentService: ContractManagementDocumentService,
  ) {}

  @Process('uploadFilesAndImagesForCM')
  async uploadFilesAndImagesForPM(job: Job) {
    try {
      if (job.data.documents) {
        if (job.data.documents?.length) {
          job.data.documents = job.data.documents.map(
            (img) => ({ ...img, buffer: Buffer.from(img.buffer) }),
          );
        }
      }

      // creating createOneYearCMs
      return await this.ContractManagementDocumentService.uploadImagesForCM(
        job.data.documents,
        job.data.user,
        job.data.token,
        job.data.cmDto,
        job.data.cm,
      );
    } catch (error) {
      console.log('error when uploading CMs documents: ', error);
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

  @OnQueueFailed()
onFailed(job: Job, err: Error) {
  console.error(`Job ${job.id} failed: ${err.message}`);
}
}
