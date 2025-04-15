import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { Area } from 'modules/areas/entities/area.entity';
import { DataSource } from 'typeorm';
import { PreventiveMaintenanceAssignees } from '../../preventive-maintenance-assignees/entities/preventive-maintenance-assignees.entity';
import { PreventiveMaintenances } from '../entities/preventive-maintenances.entity';
import { PMTypes } from '../models/pm-types.enum';
import { Statuses } from '../models/status.enum';
import * as moment from 'moment';
import { Folders } from 'modules/preventive-maintenance-documents/models/folders.enum';

@Injectable()
export class PreventiveMaintenancesRepository extends BaseRepository<PreventiveMaintenances> {
  constructor(private dataSource: DataSource) {
    super(PreventiveMaintenances, dataSource);
  }

  async findLastRecord(
    subProjectId: string,
    pmType: PMTypes,
  ): Promise<PreventiveMaintenances> {
    try {
      return this.createQueryBuilder('pm')
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        .where('subProject.id = :subProjectId', { subProjectId })
        .andWhere('pm.pm_type = :pmType', { pmType })
        .orderBy('pm.created_at', 'DESC')
        .limit(1)
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findOneWithAssignees(id: string) {
    try {
      return await this.createQueryBuilder('pm')
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        .leftJoinAndSelect('pm.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        .leftJoinAndSelect('pm.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        .leftJoinAndSelect('pm.procedure', 'procedure')
        .leftJoinAndSelect('procedure.procedureSteps', 'procedureSteps')
        .leftJoinAndSelect('pm.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect('pm.reviewedBy', 'reviewedBy')
        .leftJoinAndSelect('pm.deniedBy', 'deniedBy')
        .leftJoinAndSelect('pm.completedBy', 'completedBy')
        .leftJoinAndSelect('pm.skippedBy', 'skippedBy')
        .leftJoinAndSelect('pm.createdBy', 'createdBy')
        .leftJoinAndSelect('pm.assignees', 'assignees')
        .leftJoinAndSelect('assignees.user', 'user')
        .leftJoinAndSelect('pm.teamMembers', 'teamMembers')
        .leftJoinAndSelect('teamMembers.user', 'teamMemberUser')
        .leftJoinAndSelect('pm.team', 'team')
        .leftJoinAndSelect('team.projectTeamMembers', 'projectTeamMembers')
        .leftJoinAndSelect('projectTeamMembers.user', 'projectTeamMembersUser')
        .leftJoinAndSelect(
          'pm.masterPreventiveMaintenance',
          'masterPreventiveMaintenance',
        )
        .where('pm.id = :id', { id })
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findOneMasterPmById(id: string) {
    try {
      return await this.createQueryBuilder('pm')
        .where('pm.id = :id', { id })
        .leftJoinAndSelect(
          'pm.masterPreventiveMaintenance',
          'masterPreventiveMaintenance',
        )
        .leftJoinAndSelect(
          'masterPreventiveMaintenance.project',
          'masterProject',
        )
        .leftJoinAndSelect(
          'masterPreventiveMaintenance.subProject',
          'masterSubProject',
        )
        .leftJoinAndSelect('masterPreventiveMaintenance.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        .leftJoinAndSelect('masterPreventiveMaintenance.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        .leftJoinAndSelect(
          'masterPreventiveMaintenance.preferredSupplier',
          'masterPreferredSupplier',
        )
        .leftJoinAndSelect(
          'masterPreventiveMaintenance.assignees',
          'masterAssignees',
        )
        .leftJoinAndSelect('masterAssignees.user', 'masterUser')
        .leftJoinAndSelect(
          'masterPreventiveMaintenance.approvers',
          'masterApprovers',
        )
        .leftJoinAndSelect('masterApprovers.user', 'masterApproverUser')
        .leftJoinAndSelect(
          'masterPreventiveMaintenance.procedureLibrary',
          'masterProcedureLibrary',
        )
        // .leftJoinAndSelect(
        //   'masterProcedureLibrary.procedureSteps',
        //   'masterProcedureSteps',
        // )
        .leftJoinAndSelect(
          'masterPreventiveMaintenance.teamMembers',
          'masterTeamMembers',
        )
        .leftJoinAndSelect('masterTeamMembers.user', 'masterTeamMemberUser')
        .leftJoinAndSelect('masterPreventiveMaintenance.team', 'masterTeam')
        .leftJoinAndSelect(
          'masterTeam.projectTeamMembers',
          'masterProjectTeamMembers',
        )
        .leftJoinAndSelect(
          'masterProjectTeamMembers.user',
          'masterProjectTeamMembersUser',
        )
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findOneWithoutMaster(id: string) {
    try {
      return await this.createQueryBuilder('pm')
        .where('pm.id = :id', { id })
        .leftJoinAndSelect(
          'pm.masterPreventiveMaintenance',
          'masterPreventiveMaintenance',
        )
        // Select only necessary fields from PM
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        // Asset Relations
        .leftJoinAndSelect('pm.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        // Area Relations
        .leftJoinAndSelect('pm.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        // Procedure & Steps
        .leftJoinAndSelect('pm.procedure', 'procedure')
        .leftJoinAndSelect('procedure.procedureLibrary', 'procedureLibrary')
        // Supplier & Users
        .leftJoinAndSelect('pm.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect('pm.reviewedBy', 'reviewedBy')
        .leftJoinAndSelect('pm.deniedBy', 'deniedBy')
        .leftJoinAndSelect('pm.completedBy', 'completedBy')
        .leftJoinAndSelect('pm.skippedBy', 'skippedBy')
        .leftJoinAndSelect('pm.createdBy', 'createdBy')
        .leftJoinAndSelect('pm.inProgressBy', 'inProgressBy')
        // Assignees, Approvers, and Team Members
        .leftJoinAndSelect('pm.assignees', 'assignees')
        .leftJoinAndSelect('assignees.user', 'user')
        .leftJoinAndSelect('pm.approvers', 'approvers')
        .leftJoinAndSelect('approvers.user', 'approverUser')
        .leftJoinAndSelect('pm.teamMembers', 'teamMembers')
        .leftJoinAndSelect('teamMembers.user', 'teamMemberUser')
        // Team & Project Members
        .leftJoinAndSelect('pm.team', 'team')
        .leftJoinAndSelect('team.projectTeamMembers', 'projectTeamMembers')
        .leftJoinAndSelect('projectTeamMembers.user', 'projectTeamMembersUser')
        // Comments & Documents
        .leftJoinAndSelect('pm.reviewComment', 'reviewComment')
        .leftJoinAndSelect('pm.deniedComment', 'deniedComment')
        .leftJoinAndSelect(
          'pm.reviewDocuments',
          'reviewDocuments',
          `reviewDocuments.preventiveMaintenance = pm.id AND reviewDocuments.folder = '${Folders.SUBMIT_FOR_REVIEW}'`,
        )
        // Load relation counts instead of fetching full data
        .loadRelationCountAndMap(
          'pm.documents',
          'pm.documents',
          'documents',
          (qb) =>
            qb
              .andWhere('documents.isActive = :isActive', {
                isActive: true,
              })
              .andWhere(`documents.folder != '${Folders.ACTIVITY}'`),
        )
        .loadRelationCountAndMap(
          'masterPreventiveMaintenance.files',
          'masterPreventiveMaintenance.files',
          'files',
          (qb) =>
            qb.andWhere('files.isActive = :isActive', {
              isActive: true,
            }),
        )
        .loadRelationCountAndMap('pm.comments', 'pm.comments')
        .loadRelationCountAndMap(
          'pm.procedureStepTotalCount',
          'procedure.procedureSteps',
          'procedureSteps',
        )
        .loadRelationCountAndMap(
          'pm.procedureStepCheckedTotalCount',
          'procedure.procedureSteps',
          'procedureSteps',
          (qb) =>
            qb.andWhere('procedureSteps.isChecked = :isChecked', {
              isChecked: true,
            }),
        )
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findOneByMasterPmIdWithAssignees(id: string) {
    try {
      return await this.createQueryBuilder('pm')
        .leftJoinAndMapMany(
          'pm.assignees',
          PreventiveMaintenanceAssignees,
          'assignees',
          'assignees.preventive_maintenance_id = pm.id',
        )
        .leftJoinAndSelect('assignees.user', 'user')
        .where('pm.masterPreventiveMaintenance = :id', { id })
        .andWhere('pm.is_future =:isFuture', { isFuture: false })
        .orderBy('pm.created_at', 'DESC')
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findFutureAndCurrentPMs(
    masterPreventiveMaintenanceId: string,
    ids: string[] = [],
  ) {
    try {
      const data = this.createQueryBuilder('pm')
        .where(
          'pm.masterPreventiveMaintenance = :masterPreventiveMaintenance',
          {
            masterPreventiveMaintenance: masterPreventiveMaintenanceId,
          },
        )
        .andWhere('pm.status IN (:...statuses)', {
          statuses: [
            Statuses.PENDING,
            Statuses.IN_PROGRESS,
            Statuses.WAITING_FOR_REVIEW,
          ],
        })
        .leftJoinAndSelect('pm.procedure', 'procedure')
        .leftJoinAndSelect('procedure.procedureSteps', 'procedureSteps');
      if (ids.length) {
        data.andWhere('pm.id NOT IN (:...ids)', {
          ids: ids,
        });
      }
      return await data.getMany();
    } catch (error) {
      throw error;
    }
  }

  async findNextPMByMasterPmId(id: string) {
    try {
      return await this.createQueryBuilder('pm')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        .leftJoinAndSelect('pm.createdBy', 'createdBy')
        .where('pm.masterPreventiveMaintenance = :id', { id })
        .andWhere('pm.status = :status', { status: Statuses.PENDING })
        .andWhere('pm.is_future =:isFuture', { isFuture: true })
        .orderBy('pm.dueDate', 'ASC')
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findLastPMByMasterPmId(id: string) {
    try {
      return await this.createQueryBuilder('pm')
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        .leftJoinAndSelect('pm.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        .leftJoinAndSelect('pm.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        .leftJoinAndSelect('pm.createdBy', 'createdBy')
        .leftJoinAndSelect('pm.procedure', 'procedure')
        .leftJoinAndSelect('procedure.procedureSteps', 'procedureSteps')
        .leftJoinAndSelect('pm.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect('pm.team', 'team')
        .where('pm.masterPreventiveMaintenance = :id', { id })
        .andWhere('pm.status = :status', { status: Statuses.PENDING })
        .orderBy('pm.dueDate', 'DESC')
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findCurrentPMsByMasterPMId(
    masterPreventiveMaintenanceId: string,
    ids: string[] = [],
  ) {
    try {
      const data = this.createQueryBuilder('pm')
        .where(
          'pm.masterPreventiveMaintenance = :masterPreventiveMaintenance',
          {
            masterPreventiveMaintenance: masterPreventiveMaintenanceId,
          },
        )
        .andWhere('pm.is_future =:isFuture', { isFuture: false })
        .andWhere('pm.status IN (:...statuses)', {
          statuses: [
            Statuses.PENDING,
            Statuses.IN_PROGRESS,
            Statuses.WAITING_FOR_REVIEW,
          ],
        })
        .leftJoinAndSelect('pm.procedure', 'procedure')
        .leftJoinAndSelect('procedure.procedureSteps', 'procedureSteps');
      if (ids.length) {
        data.andWhere('pm.id NOT IN (:...id)', {
          ids: ids,
        });
      }
      return await data.orderBy('pm.dueDate', 'DESC').getMany();
    } catch (error) {
      throw error;
    }
  }

  async findCurrentPMsByMasterPMIdWithoutReopenedCounts(
    masterPreventiveMaintenanceId: string,
    ids: string[] = [],
  ) {
    try {
      const data = this.createQueryBuilder('pm')
        .leftJoin(
          'pm.masterPreventiveMaintenance',
          'masterPreventiveMaintenance',
        )
        .leftJoinAndSelect('pm.project', 'project')
        .leftJoinAndSelect('pm.subProject', 'subProject')
        // .leftJoinAndSelect('pm.area', 'area')
        // .leftJoinAndSelect('pm.asset', 'asset')
        .leftJoinAndSelect('pm.assets', 'assets')
        .leftJoinAndSelect('assets.asset', 'asset')
        .leftJoinAndSelect('pm.areas', 'areas')
        .leftJoinAndSelect('areas.area', 'area')
        .leftJoinAndSelect('pm.createdBy', 'createdBy')
        .leftJoinAndSelect('pm.procedure', 'procedure')
        .leftJoinAndSelect('procedure.procedureSteps', 'procedureSteps')
        .leftJoinAndSelect('pm.preferredSupplier', 'preferredSupplier')
        .leftJoinAndSelect('pm.team', 'team')
        .where(
          'masterPreventiveMaintenance.id = :masterPreventiveMaintenanceId',
          {
            masterPreventiveMaintenanceId,
          },
        )
        .andWhere('pm.is_future =:isFuture', { isFuture: false })
        .andWhere('pm.is_reopened =:isReopened', { isReopened: false })
        .andWhere('pm.status IN (:...statuses)', {
          statuses: [
            Statuses.PENDING,
            Statuses.IN_PROGRESS,
            Statuses.WAITING_FOR_REVIEW,
          ],
        })
        .andWhere('pm.dueDate >=:date', {
          date: `${moment().format('YYYY-MM-DD')} 24:00:00`,
        });
      if (ids.length) {
        data.andWhere('pm.id NOT IN (:...ids)', {
          ids,
        });
      }
      return await data.getCount();
    } catch (error) {
      throw error;
    }
  }
}
