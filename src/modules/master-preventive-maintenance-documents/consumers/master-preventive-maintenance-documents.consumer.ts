import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { MasterPreventiveMaintenanceDocumentsService } from '../master-preventive-maintenance-documents.service';

@Processor('masterPreventiveMaintenanceDocuments')
export class MasterPreventiveMaintenanceDocumentsConsumer {
  constructor(
    private readonly mpmDocumentsService: MasterPreventiveMaintenanceDocumentsService,
  ) {}

  @Process('uploadFilesAndImagesForPM')
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

      // creating createOneYearPMs
      await this.mpmDocumentsService.uploadFilesAndImagesForPM(
        job.data.documents,
        job.data.user,
        job.data.token,
        job.data.masterPm,
        job.data.pm,
        job.data.pmDto,
        job.data.isUpdate,
      );
    } catch (error) {
      console.log('error when creating createOneYearPMs: ', error);
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
