import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PreventiveMaintenancesService } from '../preventive-maintenances/preventive-maintenances.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreatePreventiveMaintenanceAssigneeResponseDto } from './dto/create-preventive-maintenance-assignee-response.dto';
import { CreatePreventiveMaintenanceAssigneeDto } from './dto/create-preventive-maintenance-assignee.dto';
import { MasterPreventiveMaintenanceAssignees } from './entities/master-preventive-maintenance-assignees.entity';
import { PreventiveMaintenanceAssignees } from './entities/preventive-maintenance-assignees.entity';
import { MasterPreventiveMaintenanceAssigneesRepository } from './repositories/master-preventive-maintenance-assignees.repository';
import { PreventiveMaintenanceAssigneesRepository } from './repositories/preventive-maintenance-assignees.repository';
import { In } from 'typeorm';
import { BaseResponseDto } from '@common/dto/base-response.dto';
import { PreventiveMaintenances } from 'modules/preventive-maintenances/entities/preventive-maintenances.entity';
import { NotificationsService } from 'modules/notifications/notifications.service';
import { UserFcmTokenService } from 'modules/users/services/user-fcm-token.service';
import { dateToUTC, enumToTile } from '@common/utils/utils';
import { CommentsMessages } from 'modules/comments/models/comments-messages';
import { TaskCategories } from 'modules/preventive-maintenances/models/task-categories.enum';
import { MasterPreventiveMaintenances } from 'modules/preventive-maintenances/entities/master-preventive-maintenances.entity';

@Injectable()
export class PreventiveMaintenanceAssigneesService {
  constructor(
    private pmAssigneesRepository: PreventiveMaintenanceAssigneesRepository,
    private masterPmAssigneesRepository: MasterPreventiveMaintenanceAssigneesRepository,
    @Inject(forwardRef(() => PreventiveMaintenancesService))
    private pmService: PreventiveMaintenancesService,
    private usersService: UsersService,
    private userFcmTokenService: UserFcmTokenService,
    private notificationService: NotificationsService,
  ) {}

  async findAssigneesByPMId(pm: PreventiveMaintenances) {
    return await this.pmAssigneesRepository
      .createQueryBuilder('assignee')
      .where('assignee.preventiveMaintenance = :pmId', { pmId: pm.id })
      .leftJoinAndSelect('assignee.user', 'user')
      .getMany();
  }

  async findAssigneesByMasterPmId(mpm: MasterPreventiveMaintenances) {
    return await this.masterPmAssigneesRepository
      .createQueryBuilder('assignee')
      .where('assignee.masterPreventiveMaintenance = :mpmId', { mpmId: mpm.id })
      .leftJoinAndSelect('assignee.user', 'user')
      .getMany();
  }

  async create(
    pmId: string,
    createPMAssigneeDto: CreatePreventiveMaintenanceAssigneeDto,
    requestUser?: User,
  ): Promise<CreatePreventiveMaintenanceAssigneeResponseDto> {
    try {
      const isExist = await this.pmService.findOneByIdWithoutRelations(pmId);
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      const user = await this.usersService.findOneById(
        createPMAssigneeDto.userId,
      );
      const isExistAssignee = await this.pmAssigneesRepository
        .createQueryBuilder('assignee')
        .where('assignee.user = :userId', { userId: user.id })
        .andWhere('assignee.preventiveMaintenance = :pmId', { pmId })
        .getOne();

      if (isExistAssignee) {
        throw new BadRequestException('Assignee already exist');
      }
      const assignee = await this.pmAssigneesRepository.save(
        new PreventiveMaintenanceAssignees({
          user: user,
          preventiveMaintenance: isExist,
        }),
      );
      const messageType =
        isExist.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
        isExist.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
          ? isExist.taskCategory
          : 'TASK';
      const messageText = CommentsMessages.ASSIGNEE_ADDED.replace(
        '{type}',
        enumToTile(messageType),
      );
      await this.sendAssigneeUpdateNotification(
        requestUser,
        isExist,
        assignee.user.id,
        messageText,
      );
      return {
        message: 'Assignee added to preventive maintenance',
        data: { assignee },
      };
    } catch (error) {
      throw error;
    }
  }

  async createForMaster(
    masterPmId: string,
    createPMAssigneeDto: CreatePreventiveMaintenanceAssigneeDto,
    requestUser?: User,
  ): Promise<CreatePreventiveMaintenanceAssigneeResponseDto> {
    try {
      const [isExist, findCurrentPM, findCurrentPMs] = await Promise.all([
        this.pmService.masterFindOneById(masterPmId),
        this.pmService.findOneByMasterPmId(masterPmId),
        this.pmService.findFutureAndCurrentPMs(masterPmId),
      ]);
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      const user = await this.usersService.findOneById(
        createPMAssigneeDto.userId,
      );
      const isExistAssigneeForMaster = await this.masterPmAssigneesRepository
        .createQueryBuilder('assignee')
        .where('assignee.user = :userId', { userId: user.id })
        .andWhere('assignee.masterPreventiveMaintenance = :masterPmId', {
          masterPmId,
        })
        .getOne();
      if (isExistAssigneeForMaster) {
        throw new BadRequestException('Assignee already exist');
      }
      if (findCurrentPMs.length) {
        await Promise.all(
          findCurrentPMs.map(async (pm) => {
            const isExistAssignee = await this.pmAssigneesRepository
              .createQueryBuilder('assignee')
              .where('assignee.user = :userId', { userId: user.id })
              .andWhere('assignee.preventiveMaintenance = :pmId', {
                pmId: pm.id,
              })
              .getOne();
            if (!isExistAssignee) {
              await this.pmAssigneesRepository.save(
                new PreventiveMaintenanceAssignees({
                  user: user,
                  preventiveMaintenance: pm,
                }),
              );
            }
          }),
        );
      }
      const assignee = await this.masterPmAssigneesRepository.save(
        new MasterPreventiveMaintenanceAssignees({
          user: user,
          masterPreventiveMaintenance: isExist,
        }),
      );
      const messageType =
        isExist.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
        isExist.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
          ? isExist.taskCategory
          : 'TASK';
      const messageText = CommentsMessages.ASSIGNEE_ADDED.replace(
        '{type}',
        enumToTile(messageType),
      );
      await this.sendAssigneeUpdateNotification(
        requestUser,
        findCurrentPM,
        assignee.user.id,
        messageText,
      );
      return {
        message: 'Assignee added to master preventive maintenance',
        data: { assignee },
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(
    pmId: string,
    userId: string,
    requestUser?: User,
  ): Promise<CreatePreventiveMaintenanceAssigneeResponseDto> {
    try {
      const isExist = await this.pmAssigneesRepository.findOneBy({
        user: { id: userId },
        preventiveMaintenance: { id: pmId },
      });
      if (!isExist) {
        throw new NotFoundException(
          'Preventive maintenance assignee does not exist',
        );
      }
      const pmDetails = await this.pmService.findOneByIdWithoutRelations(pmId);
      const assignee = await this.pmAssigneesRepository.remove(isExist);
      const messageType =
        pmDetails.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
        pmDetails.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
          ? pmDetails.taskCategory
          : 'TASK';
      const messageText = CommentsMessages.ASSIGNEE_REMOVED.replace(
        '{type}',
        enumToTile(messageType),
      );
      await this.sendAssigneeUpdateNotification(
        requestUser,
        pmDetails,
        userId,
        messageText,
      );
      return {
        message: 'Assignee remove to preventive maintenance',
        data: { assignee },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(pmIds: string[]): Promise<BaseResponseDto> {
    try {
      await this.pmAssigneesRepository.delete({
        preventiveMaintenance: In(pmIds),
      });
      return {
        message: 'Assignees delete to preventive maintenance',
      };
    } catch (error) {
      throw error;
    }
  }

  async removeForMaster(
    masterPmId: string,
    userId: string,
    requestUser?: User,
  ): Promise<CreatePreventiveMaintenanceAssigneeResponseDto> {
    try {
      const [isExistForMaster, findCurrentPM, findCurrentPMs] =
        await Promise.all([
          this.masterPmAssigneesRepository.findOneBy({
            user: { id: userId },
            masterPreventiveMaintenance: { id: masterPmId },
          }),
          this.pmService.findOneByMasterPmId(masterPmId),
          this.pmService.findFutureAndCurrentPMs(masterPmId),
        ]);
      const isExist = await this.pmAssigneesRepository.findOneBy({
        user: { id: userId },
        preventiveMaintenance: { id: findCurrentPM.id },
      });
      if (!isExistForMaster) {
        throw new NotFoundException(
          'Preventive maintenance assignee does not exist',
        );
      }
      if (isExist) {
        await this.pmAssigneesRepository.delete({
          preventiveMaintenance: In(findCurrentPMs.map((pm) => pm.id)),
          user: In([userId]),
        });
      }
      const assignee = await this.masterPmAssigneesRepository.remove(
        isExistForMaster,
      );
      const messageType =
        findCurrentPM.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
        findCurrentPM.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
          ? findCurrentPM.taskCategory
          : 'TASK';
      const messageText = CommentsMessages.ASSIGNEE_REMOVED.replace(
        '{type}',
        enumToTile(messageType),
      );
      await this.sendAssigneeUpdateNotification(
        requestUser,
        findCurrentPM,
        userId,
        messageText,
      );
      return {
        message: 'Assignee remove to master preventive maintenance',
        data: { assignee },
      };
    } catch (error) {
      throw error;
    }
  }

  async insertMany(pmAssignees) {
    try {
      return await this.pmAssigneesRepository.insert(pmAssignees);
    } catch (error) {
      throw error;
    }
  }

  async insertManyMaster(masterPmAssignees) {
    try {
      return await this.masterPmAssigneesRepository.insert(masterPmAssignees);
    } catch (error) {
      throw error;
    }
  }

  async createAndRemove(pmId: string, userIds: string[]) {
    try {
      const existingAssignees = await this.pmAssigneesRepository
        .createQueryBuilder('assignee')
        .where('assignee.preventiveMaintenance = :pmId', { pmId })
        .getRawMany();
      const existingUsersList = existingAssignees.map(
        (ass) => ass.assignee_user_id,
      );
      const existingRemovingUsersList = existingUsersList.filter(
        (userId) => !userIds.includes(userId),
      );
      if (existingRemovingUsersList.length) {
        this.pmAssigneesRepository.delete({
          preventiveMaintenance: In([pmId]),
          user: In(existingRemovingUsersList),
        });
      }
      const nonExistingUsers = userIds.filter(
        (userId) => !existingUsersList.includes(userId),
      );

      if (nonExistingUsers.length > 0) {
        await this.insertMany([
          ...nonExistingUsers.map((user) => ({
            user: user,
            preventiveMaintenance: pmId,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async createAndRemoveMaster(masterPmId: string, userIds: string[]) {
    try {
      const existingAssignees = await this.masterPmAssigneesRepository
        .createQueryBuilder('assignee')
        .where('assignee.masterPreventiveMaintenance = :masterPmId', {
          masterPmId,
        })
        .getRawMany();
      const existingUsersList = existingAssignees.map(
        (ass) => ass.assignee_user_id,
      );
      const existingRemovingUsersList = existingUsersList.filter(
        (userId) => !userIds.includes(userId),
      );
      if (existingRemovingUsersList.length) {
        this.masterPmAssigneesRepository.delete({
          masterPreventiveMaintenance: In([masterPmId]),
          user: In(existingRemovingUsersList),
        });
      }
      const nonExistingUsers = userIds.filter(
        (userId) => !existingUsersList.includes(userId),
      );
      if (nonExistingUsers.length) {
        await this.insertManyMaster([
          ...nonExistingUsers.map((user) => ({
            user: user,
            masterPreventiveMaintenance: masterPmId,
            createdAt: dateToUTC(),
            updatedAt: dateToUTC(),
          })),
        ]);
      }
    } catch (error) {
      throw error;
    }
  }

  async sendAssigneeUpdateNotification(
    user: User,
    pm: PreventiveMaintenances,
    assigneeId: string,
    messageText: string,
  ) {
    try {
      const { pmType, workId, workTitle, area, asset } = pm;
      const deviceIds = await this.userFcmTokenService.findFcmTokensByUserIds([
        assigneeId,
      ]);

      const requestUser = `${user.first_name} ${user.last_name}`;
      const message = `${requestUser} ${messageText}`;

      const notification = {
        workId,
        workTitle,
        type: pmType,
        // areaId: area?.id || '',
        // assetId: asset?.id || '',
        // assetName: asset?.name || '',
        // assetPackageName: area?.name || '',
        userId: user.id,
      };
      await Promise.all([
        this.notificationService.createPmNotification(
          // saving notifcation in the db
          pm,
          messageText,
          user.id,
          true,
          [{ id: assigneeId }] as any,
        ),
        this.notificationService.sendNotificationToMultipleDevices(
          // sending push notifications to the devices
          deviceIds,
          message,
          notification,
        ),
      ]);
    } catch (error) {
      console.log('error in sendAssigneeUpdateNotification: ', error);
    }
  }
}
