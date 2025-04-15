import { Module } from '@nestjs/common';
import { IncidentReportsService } from './incident-reports.service';
import { IncidentReportsController } from './incident-reports.controller';
import { IncidentReportsRepository } from './repositories/incident-repository';
import { ProjectsModule } from 'modules/projects/projects.module';
import { IncidentReportTeamMembersModule } from 'modules/incident-report-team-members/incident-report-team-members.module';
import { UsersModule } from 'modules/users/users.module';
import { FilesUploadModule } from 'modules/files-upload/files-upload.module';
import { IncidentReportDocumentRepository } from './repositories/incident-report-document.repository';
import { SendGridModule } from '@core/sendgrid/sendgrid.module';
import { IncidentReportCommentsModule } from 'modules/incident-report-comments/incident-report-comments.module';
import { IncidentReportCommentsRepository } from 'modules/incident-report-comments/repositories/incident-report-comments.repository';
import { IncidentReportAreasService } from './incident-reports-areas.service';
import { IncidentReportAssetsService } from './incident-reports-assets.services';
import { AreasModule } from 'modules/areas/areas.module';
import { AssetsModule } from 'modules/assets/assets.module';
import { IncidentReportAssetsRepository } from './repositories/incident-report-assets.repository';
import { IncidentReportAreasRepository } from './repositories/incident-report-areas.repository';
import { ProjectAffectedSystemRepository } from 'modules/projects/repositories/incident-report-affected-system.repository';
import { ProjectIncidentImpactRepository } from 'modules/projects/repositories/incident-report-impact.repository';

@Module({
  imports: [
    UsersModule,
    ProjectsModule,
    FilesUploadModule,
    IncidentReportTeamMembersModule,
    IncidentReportCommentsModule,
    SendGridModule,
    AssetsModule,
    AreasModule,
  ],
  exports: [IncidentReportsService],
  controllers: [IncidentReportsController],
  providers: [
    IncidentReportsService,
    IncidentReportsRepository,
    IncidentReportDocumentRepository,
    IncidentReportCommentsRepository,
    IncidentReportAssetsService,
    IncidentReportAreasService,
    IncidentReportAreasRepository,
    IncidentReportAssetsRepository,
    ProjectAffectedSystemRepository,
    ProjectIncidentImpactRepository,
  ],
})
export class IncidentReportsModule {}
