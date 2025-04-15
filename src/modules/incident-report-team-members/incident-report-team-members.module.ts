import { Module, forwardRef } from '@nestjs/common';
import { IncidentReportTeamMembersService } from './incident-report-team-members.service';
import { IncidentReportTeamMembersController } from './incident-report-team-members.controller';
import { UsersModule } from 'modules/users/users.module';
import { IncidentReportsModule } from 'modules/incident-reports/incident-reports.module';
import { UserFcmToken } from 'modules/users/entities/user-fcm-token.entity';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { IncidentReportTeamMembersRepository } from './repositories/incident-report-team-members.repository';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => IncidentReportsModule),
    UserFcmToken,
    NotificationsModule,
  ],
  controllers: [IncidentReportTeamMembersController],
  providers: [
    IncidentReportTeamMembersService,
    IncidentReportTeamMembersRepository,
  ],
  exports: [IncidentReportTeamMembersService],
})
export class IncidentReportTeamMembersModule {}
