import { Injectable } from '@nestjs/common';
import { AssetsService } from 'modules/assets/assets.service';
import { DocumentsService } from 'modules/documents/documents.service';
import { ProceduresService } from 'modules/procedures/procedures.service';
import { ProjectsService } from 'modules/projects/projects.service';
import { User } from 'modules/users/entities/user.entity';
import { UsersService } from 'modules/users/users.service';
import { GetDashboardPlatformSummaryResponse } from './dto/get-dashboard-platform-summary.dto';
import { AreasService } from 'modules/areas/areas.service';

@Injectable()
export class DashboardService {
  constructor(
    private usersService: UsersService,
    private assetsService: AssetsService,
    private areasService: AreasService,
    private projectsService: ProjectsService,
    private documentsService: DocumentsService,
    private proceduresService: ProceduresService,
  ) {}

  async getPlatformSummary(
    projectId: string,
    user: User,
  ): Promise<GetDashboardPlatformSummaryResponse> {
    let projectIds = [projectId];
    const data = await Promise.all([
      this.projectsService.findProjectsAndSubProjectByUserId(user.id),
      this.usersService.findOneById(user.id),
    ]);
    const masterProjects = data[0];
    user = data[1];
    if (!projectId) {
      projectIds = masterProjects.map(({ project }) => project.id);
    }
    const subProjectIds = projectId
      ? (
          await this.projectsService.findByIdsMasterProjectWithSubProjects(
            projectIds,
          )
        )
          .map(({ subProjects }) =>
            subProjects.map((subProject) => subProject.id),
          )
          .flat(1)
      : masterProjects
          .map(({ project }) =>
            project.subProjects.map((subProject) => subProject.id),
          )
          .flat(1);

    const [
      totalAssets,
      totalAreas,
      totalProcedures,
      totalSites,
      totalDocuments,
    ] = await Promise.all([
      this.assetsService.getCount(subProjectIds),
      this.areasService.getCount(subProjectIds),
      this.proceduresService.getCount(projectIds),
      this.projectsService.getCount(projectIds, !projectId ? user.id : null),
      this.documentsService.getCount(subProjectIds),
    ]);

    return {
      data: {
        totalSites,
        totalAssets: totalAssets + totalAreas,
        totalDocuments,
        totalProcedures,
      },
      message: 'Platform summary',
    };
  }
}
