import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IncidentReport } from '../entities/incident-report.entity';

@Injectable()
export class IncidentReportsRepository extends BaseRepository<IncidentReport> {
  constructor(private dataSource: DataSource) {
    super(IncidentReport, dataSource);
  }

  async findLastRecord(projectId: string): Promise<IncidentReport> {
    try {
      return this.createQueryBuilder('ir')
        .leftJoinAndSelect('ir.project', 'project')
        .where('project.id = :projectId', { projectId })
        .orderBy('ir.created_at', 'DESC')
        .limit(1)
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findOneWithTeam(id: string) {
    try {
      return await this.createQueryBuilder('ir')
        .where('ir.id = :id', { id })
        .addSelect([
          'project.id',
          'project.name',
          'project.latitude',
          'project.longitude',
          'subProject.id',
          'subProject.name',
          'affectedSystem.id',
          'affectedSystem.name',
          'impact.id',
          'impact.name',
          'asset.id',
          'asset.name',
          'area.id',
          'area.name',
        ])
        .leftJoin('ir.project', 'project')
        .leftJoin('ir.subProject', 'subProject')
        .leftJoinAndSelect('ir.affectedSystem', 'affectedSystem')
        .leftJoinAndSelect('ir.impact', 'impact')
        .leftJoinAndSelect('ir.teamMembers', 'teamMembers')
        .leftJoinAndSelect('teamMembers.user', 'teamMemberUser')
        .leftJoinAndSelect('ir.team', 'team')
        .leftJoinAndSelect('team.projectTeamMembers', 'projectTeamMembers')
        .leftJoinAndSelect('projectTeamMembers.user', 'projectTeamMembersUser')
        .leftJoinAndSelect('ir.assets', 'assets')
        .leftJoin('assets.asset', 'asset')
        .leftJoinAndSelect('ir.areas', 'areas')
        .leftJoin('areas.area', 'area')
        .leftJoinAndSelect(
          'ir.documents',
          'documents',
          `documents.isActive = true`,
        )
        .leftJoinAndSelect('ir.createdBy', 'createdBy')
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findOneWithAssetsAreas(id: string) {
    try {
      return await this.createQueryBuilder('ir')
        .where('ir.id = :id', { id })
        .addSelect([
          'project.id',
          'project.name',
          'project.latitude',
          'project.longitude',
          'subProject.id',
          'subProject.name',
          'affectedSystem.id',
          'affectedSystem.name',
          'impact.id',
          'impact.name',
          'asset.id',
          'asset.name',
          'area.id',
          'area.name',
        ])
        .leftJoin('ir.project', 'project')
        .leftJoin('ir.subProject', 'subProject')
        .leftJoinAndSelect('ir.affectedSystem', 'affectedSystem')
        .leftJoinAndSelect('ir.impact', 'impact')
        .leftJoinAndSelect('ir.assets', 'assets')
        .leftJoin('assets.asset', 'asset')
        .leftJoinAndSelect('ir.areas', 'areas')
        .leftJoin('areas.area', 'area')
        .getOne();
    } catch (error) {
      throw error;
    }
  }
}
