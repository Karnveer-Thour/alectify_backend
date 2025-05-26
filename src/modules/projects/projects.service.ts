import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsRepository } from './repositories/projects.repository';
import { SubProjectsRepository } from './repositories/sub-projects.repository';
import { In } from 'typeorm';
import { ProjectTeamsRepository } from './repositories/project-teams.repository';
import { ProjectTeams } from './entities/project-teams.entity';
import { randomUUID } from 'crypto';
import { ProjectTeamMembersRepository } from './repositories/project-team-members.repository';
import { dateToUTC } from '@common/utils/utils';
import { CreateTeamDto } from './dto/create-team.dto';
import { UsersService } from 'modules/users/users.service';
import { ProjectAccountsRepository } from './repositories/project-accounts.repository';

import { ProjectAffectedSystemRepository } from './repositories/incident-report-affected-system.repository';
import { ProjectIncidentImpactRepository } from './repositories/incident-report-impact.repository';
import {
  CreateAffectedSystemDto,
  BulkCreateAffectedSystemDto,
} from './dto/incident-report-affected-system.dto';
import {
  CreateImpactDto,
  BulkCreateImpactDto,
} from './dto/incident-report-impact.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private projectRepository: ProjectsRepository,
    private projectAccountsRepository: ProjectAccountsRepository,
    private projectTeamsRepository: ProjectTeamsRepository,
    private projectTeamMembersRepository: ProjectTeamMembersRepository,
    private subProjectsRepository: SubProjectsRepository,
    private usersService: UsersService,
    private affectedSystemRepository: ProjectAffectedSystemRepository,
    private impactRepository: ProjectIncidentImpactRepository,
  ) {}

  async findAffectedSystemById(id: string): Promise<any> {
    try {
      return this.affectedSystemRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  async findImpactById(id: string): Promise<any> {
    try {
      return this.impactRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string) {
    try {
      return this.projectRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneByIdSubProject(id: string) {
    try {
      return this.subProjectsRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneByIdTeam(id: string) {
    try {
      return this.projectTeamsRepository.findOne({
        where: { id: id },
        relations: ['projectTeamMembers', 'projectTeamMembers.user'],
      });
    } catch (error) {
      throw error;
    }
  }

  async findByIdsMasterProjectWithSubProjects(ids: string[]) {
    try {
      return this.projectRepository.find({
        where: { id: In(ids) },
        relations: ['subProjects'],
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneByIdSubProjectWithMasterProject(id: string) {
    try {
      return this.subProjectsRepository.findOne({
        where: { id },
        relations: ['project'],
      });
    } catch (error) {
      throw error;
    }
  }

  async findProjectsAndSubProjectByUserId(userId: string) {
    try {
      return this.projectAccountsRepository
        .createQueryBuilder('ac')
        .where('ac.user =:userId', {
          userId,
        })
        .leftJoinAndSelect('ac.project', 'project')
        .leftJoinAndSelect('project.subProjects', 'subProjects')
        .getMany();
    } catch (error) {
      throw error;
    }
  }

  async findMasterProjectsByUserId(userId: string) {
    try {
      return this.projectAccountsRepository
        .createQueryBuilder('ac')
        .leftJoinAndSelect('ac.project', 'project')
        .where('ac.user =:userId', {
          userId,
        })
        .getMany();
    } catch (error) {
      throw error;
    }
  }

  async findMasterProjectByUserIdAndProjectId(userId: string,projectId:string) {
    try {
      return this.projectAccountsRepository
        .createQueryBuilder('ac')
        .leftJoinAndSelect('ac.project', 'project')
        .where('ac.user =:userId', {
          userId,
        })
        .where('ac.project.id =:projectId', {
          projectId,
        })
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findOneProjectTeamById(id: string) {
    try {
      return this.projectTeamsRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw error;
    }
  }

  async createProjectTeam(team: CreateTeamDto) {
    try {
      const project = await this.findOneById(team.projectId);
      const findUsers = await this.usersService.findUsersByIds(team.userIds);
      const createTeam = await this.projectTeamsRepository.save(
        new ProjectTeams({
          id: randomUUID(),
          name: team.name,
          description: team.description,
          isActive: true,
          project: project,
          createdAt: dateToUTC(),
          updatedAt: dateToUTC(),
        }),
      );
      const teamMembers: any = findUsers.map((user) => ({
        projectTeam: createTeam,
        user: user,
      }));
      await this.projectTeamMembersRepository.insert(teamMembers);

      return createTeam;
    } catch (error) {
      throw error;
    }
  }

  async getCount(projectIds: string[], userId?: string): Promise<number> {
    if (!userId) {
      return this.projectRepository.count({ where: { id: In(projectIds) } });
    } else {
      return this.projectAccountsRepository
        .createQueryBuilder('ac')
        .where('ac.user =:userId', {
          userId,
        })
        .getCount();
    }
  }

  async findAllAffectedSystems(projectId: string) {
    const systems = await this.affectedSystemRepository.findAllByProject(
      projectId,
    );

    if (systems.length === 0) {
      return {
        status: false,
        statusCode: 404,
        message: 'No Affected system found for the given project.',
      };
    }

    const res = systems.map((system) => ({
      id: system.id,
      name: system.name,
    }));

    return {
      status: true,
      statusCode: 200,
      data: res,
    };
  }

  async createAffectedSystem(dto: CreateAffectedSystemDto) {
    const project = await this.findOneById(dto.projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${dto.projectId} not found`);
    }

    const affectedSystem = this.affectedSystemRepository.create({
      name: dto.name,
      project,
    });

    await this.affectedSystemRepository.save(affectedSystem);

    return {
      id: affectedSystem.id,
      name: affectedSystem.name,
      projectId: dto.projectId,
    };
  }

  async findAllImpacts(projectId: string) {
    const impacts = await this.impactRepository.findAllByProject(projectId);

    if (impacts.length === 0) {
      return {
        status: false,
        statusCode: 404,
        message: 'No impacts found for the given project.',
      };
    }

    const res = impacts.map((impact) => ({
      id: impact.id,
      name: impact.name,
    }));

    return {
      status: true,
      statusCode: 200,
      data: res,
    };
  }

  async createImpact(dto: CreateImpactDto) {
    const project = await this.findOneById(dto.projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${dto.projectId} not found`);
    }

    const impact = this.impactRepository.create({
      name: dto.name,
      project,
    });

    await this.impactRepository.save(impact);

    return {
      id: impact.id,
      name: impact.name,
      projectId: dto.projectId,
    };
  }

  async bulkCreateAffectedSystems(
    projectId: string,
    dto: BulkCreateAffectedSystemDto[],
  ) {
    const project = await this.findOneById(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const affectedSystems = dto.map((item) =>
      this.affectedSystemRepository.create({
        name: item.name,
        project,
      }),
    );

    this.affectedSystemRepository.save(affectedSystems);
    return {
      message: 'Affected systems created successfully',
      data: null,
    };
  }

  async bulkCreateImpacts(projectId: string, dto: BulkCreateImpactDto[]) {
    const project = await this.findOneById(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const impacts = dto.map((item) =>
      this.impactRepository.create({
        name: item.name,
        project,
      }),
    );

    this.impactRepository.save(impacts);
    return {
      message: 'Impacts created successfully',
      data: null,
    };
  }
}
