import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectsRepository } from './repositories/projects.repository';
import { SubProjectsRepository } from './repositories/sub-projects.repository';
import { ProjectTeamsRepository } from './repositories/project-teams.repository';
import { ProjectTeamMembersRepository } from './repositories/project-team-members.repository';
import { UsersModule } from 'modules/users/users.module';
import { ProjectAccountsRepository } from './repositories/project-accounts.repository';
import { ProjectAffectedSystemRepository } from './repositories/incident-report-affected-system.repository';
import { ProjectIncidentImpactRepository } from './repositories/incident-report-impact.repository';

@Module({
  imports: [UsersModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectsRepository,
    ProjectAccountsRepository,
    SubProjectsRepository,
    ProjectTeamsRepository,
    ProjectTeamMembersRepository,
    ProjectAffectedSystemRepository,
    ProjectIncidentImpactRepository,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
