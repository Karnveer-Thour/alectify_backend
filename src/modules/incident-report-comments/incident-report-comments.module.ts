import { forwardRef, Module } from '@nestjs/common';
import { IncidentReportCommentsService } from './incident-report-comments.service';
import { IncidentReportCommentsController } from './incident-report-comments.controller';
import { IncidentReportCommentsRepository } from './repositories/incident-report-comments.repository';
import { IncidentReportsModule } from 'modules/incident-reports/incident-reports.module';
import { IncidentReportsRepository } from 'modules/incident-reports/repositories/incident-repository';
import { UsersModule } from 'modules/users/users.module';
import { FilesUploadModule } from 'modules/files-upload/files-upload.module';
import { IncidentReportCommentFilesRepository } from './repositories/incident-report-comment-files.repository';
import { SendGridModule } from '@core/sendgrid/sendgrid.module';

@Module({
  imports: [
    forwardRef(() => IncidentReportsModule),
    UsersModule,
    FilesUploadModule,
    SendGridModule,
  ],
  exports: [],
  controllers: [IncidentReportCommentsController],
  providers: [
    IncidentReportCommentsService,
    IncidentReportCommentsRepository,
    IncidentReportCommentFilesRepository,
    IncidentReportsRepository,
  ],
})
export class IncidentReportCommentsModule {}
