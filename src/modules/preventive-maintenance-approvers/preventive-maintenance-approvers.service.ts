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
import { CreatePreventiveMaintenanceApproverResponseDto } from './dto/create-preventive-maintenance-approver-response.dto';
import { CreatePreventiveMaintenanceApproverDto } from './dto/create-preventive-maintenance-approver.dto';
import { MasterPreventiveMaintenanceApprovers } from './entities/master-preventive-maintenance-approvers.entity';
import { PreventiveMaintenanceApprovers } from './entities/preventive-maintenance-approvers.entity';
import { MasterPreventiveMaintenanceApproversRepository } from './repositories/master-preventive-maintenance-approvers.repository';
import { PreventiveMaintenanceApproversRepository } from './repositories/preventive-maintenance-approvers.repository';
import { In } from 'typeorm';
import { BaseResponseDto } from '@common/dto/base-response.dto';
import { PreventiveMaintenances } from 'modules/preventive-maintenances/entities/preventive-maintenances.entity';
import { NotificationsService } from 'modules/notifications/notifications.service';
import { UserFcmTokenService } from 'modules/users/services/user-fcm-token.service';
import { dateToUTC, enumToTile } from '@common/utils/utils';
import { CommentsMessages } from 'modules/comments/models/comments-messages';
import { MasterPreventiveMaintenances } from 'modules/preventive-maintenances/entities/master-preventive-maintenances.entity';
import { TaskCategories } from 'modules/preventive-maintenances/models/task-categories.enum';

@Injectable()
export class PreventiveMaintenanceApproversService {
  constructor(
    private pmApproversRepository: PreventiveMaintenanceApproversRepository,
    private masterPmApproversRepository: MasterPreventiveMaintenanceApproversRepository,
    @Inject(forwardRef(() => PreventiveMaintenancesService))
    private pmService: PreventiveMaintenancesService,
    private usersService: UsersService,
    private userFcmTokenService: UserFcmTokenService,
    private notificationService: NotificationsService,
  ) {}

  async findApproversByPMId(pm: PreventiveMaintenances) {
    return await this.pmApproversRepository
      .createQueryBuilder('approver')
      .where('approver.preventiveMaintenance = :pmId', { pmId: pm.id })
      .leftJoinAndSelect('approver.user', 'user')
      .getMany();
  }

  async findApproversByMasterPMId(pm: MasterPreventiveMaintenances) {
    return await this.masterPmApproversRepository
      .createQueryBuilder('approver')
      .where('approver.masterPreventiveMaintenance = :pmId', { pmId: pm.id })
      .leftJoinAndSelect('approver.user', 'user')
      .getMany();
  }

  async create(
    pmId: string,
    createPMApproverDto: CreatePreventiveMaintenanceApproverDto,
    requestUser?: User,
  ): Promise<CreatePreventiveMaintenanceApproverResponseDto> {
    try {
      const isExist = await this.pmService.findOneByIdWithoutRelations(pmId);
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }
      const user = await this.usersService.findOneById(
        createPMApproverDto.userId,
      );
      const isExistApprover = await this.pmApproversRepository
        .createQueryBuilder('approver')
        .where('approver.user = :userId', { userId: user.id })
        .andWhere('approver.preventiveMaintenance = :pmId', { pmId })
        .getOne();

      if (isExistApprover) {
        throw new BadRequestException('Approver already exist');
      }
      const approver = await this.pmApproversRepository.save(
        new PreventiveMaintenanceApprovers({
          user: user,
          preventiveMaintenance: isExist,
        }),
      );
      const messageType =
        isExist.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
        isExist.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
          ? isExist.taskCategory
          : 'TASK';
      const messageText = CommentsMessages.APPROVER_ADDED.replace(
        '{type}',
        enumToTile(messageType),
      );
      await this.sendApproverUpdateNotification(
        requestUser,
        isExist,
        approver.user.id,
        messageText,
      );
      return {
        message: 'Approver added to preventive maintenance',
        data: { approver },
      };
    } catch (error) {
      throw error;
    }
  }

  async createForMaster(
    masterPmId: string,
    createPMApproverDto: CreatePreventiveMaintenanceApproverDto,
    requestUser?: User,
  ): Promise<CreatePreventiveMaintenanceApproverResponseDto> {
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
        createPMApproverDto.userId,
      );
      const isExistApproverForMaster = await this.masterPmApproversRepository
        .createQueryBuilder('approver')
        .where('approver.user = :userId', { userId: user.id })
        .andWhere('approver.masterPreventiveMaintenance = :masterPmId', {
          masterPmId,
        })
        .getOne();
      if (isExistApproverForMaster) {
        throw new BadRequestException('Approver already exist');
      }
      if (findCurrentPMs.length) {
        await Promise.all(
          findCurrentPMs.map(async (pm) => {
            const isExistApprover = await this.pmApproversRepository
              .createQueryBuilder('approver')
              .where('approver.user = :userId', { userId: user.id })
              .andWhere('approver.preventiveMaintenance = :pmId', {
                pmId: pm.id,
              })
              .getOne();
            if (!isExistApprover) {
              await this.pmApproversRepository.save(
                new PreventiveMaintenanceApprovers({
                  user: user,
                  preventiveMaintenance: pm,
                }),
              );
            }
          }),
        );
      }
      const approver = await this.masterPmApproversRepository.save(
        new MasterPreventiveMaintenanceApprovers({
          user: user,
          masterPreventiveMaintenance: isExist,
        }),
      );
      const messageType =
        isExist.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
        isExist.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
          ? isExist.taskCategory
          : 'TASK';
      const messageText = CommentsMessages.APPROVER_ADDED.replace(
        '{type}',
        enumToTile(messageType),
      );
      await this.sendApproverUpdateNotification(
        requestUser,
        findCurrentPM,
        approver.user.id,
        messageText,
      );
      return {
        message: 'Approver added to master preventive maintenance',
        data: { approver },
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(
    pmId: string,
    userId: string,
    requestUser?: User,
  ): Promise<CreatePreventiveMaintenanceApproverResponseDto> {
    try {
      const isExist = await this.pmApproversRepository.findOneBy({
        user: { id: userId },
        preventiveMaintenance: { id: pmId },
      });
      if (!isExist) {
        throw new NotFoundException(
          'Preventive maintenance approver does not exist',
        );
      }
      const pmDetails = await this.pmService.findOneByIdWithoutRelations(pmId);
      const approver = await this.pmApproversRepository.remove(isExist);
      const messageType =
        pmDetails.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
        pmDetails.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
          ? pmDetails.taskCategory
          : 'TASK';
      const messageText = CommentsMessages.APPROVER_REMOVED.replace(
        '{type}',
        enumToTile(messageType),
      );
      await this.sendApproverUpdateNotification(
        requestUser,
        pmDetails,
        userId,
        messageText,
      );
      return {
        message: 'Approver remove to preventive maintenance',
        data: { approver },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(pmIds: string[]): Promise<BaseResponseDto> {
    try {
      await this.pmApproversRepository.delete({
        preventiveMaintenance: In(pmIds),
      });
      return {
        message: 'Approvers delete to preventive maintenance',
      };
    } catch (error) {
      throw error;
    }
  }

  async removeForMaster(
    masterPmId: string,
    userId: string,
    requestUser?: User,
  ): Promise<CreatePreventiveMaintenanceApproverResponseDto> {
    try {
      const [isExistForMaster, findCurrentPM, findCurrentPMs] =
        await Promise.all([
          this.masterPmApproversRepository.findOneBy({
            user: { id: userId },
            masterPreventiveMaintenance: { id: masterPmId },
          }),
          this.pmService.findOneByMasterPmId(masterPmId),
          this.pmService.findFutureAndCurrentPMs(masterPmId),
        ]);
      const isExist = await this.pmApproversRepository.findOneBy({
        user: { id: userId },
        preventiveMaintenance: { id: findCurrentPM.id },
      });
      if (!isExistForMaster) {
        throw new NotFoundException(
          'Preventive maintenance approver does not exist',
        );
      }
      if (isExist) {
        await this.pmApproversRepository.delete({
          preventiveMaintenance: In(findCurrentPMs.map((pm) => pm.id)),
          user: In([userId]),
        });
      }
      const approver = await this.masterPmApproversRepository.remove(
        isExistForMaster,
      );
      const messageType =
        findCurrentPM.taskCategory === TaskCategories.CORRECTIVE_MAINTENANCE ||
        findCurrentPM.taskCategory === TaskCategories.PREVENTIVE_MAINTENANCE
          ? findCurrentPM.taskCategory
          : 'TASK';
      const messageText = CommentsMessages.APPROVER_REMOVED.replace(
        '{type}',
        enumToTile(messageType),
      );
      await this.sendApproverUpdateNotification(
        requestUser,
        findCurrentPM,
        userId,
        messageText,
      );
      return {
        message: 'Approver remove to master preventive maintenance',
        data: { approver },
      };
    } catch (error) {
      throw error;
    }
  }

  async insertMany(pmApprovers) {
    try {
      return await this.pmApproversRepository.insert(pmApprovers);
    } catch (error) {
      throw error;
    }
  }

  async insertManyMaster(masterPmApprover) {
    try {
      return await this.masterPmApproversRepository.insert(masterPmApprover);
    } catch (error) {
      throw error;
    }
  }

  async createAndRemove(pmId: string, userIds: string[]) {
    try {
      const existingApprovers = await this.pmApproversRepository
        .createQueryBuilder('approver')
        .where('approver.preventiveMaintenance = :pmId', { pmId })
        .getRawMany();
      const existingUsersList = existingApprovers.map(
        (app) => app.approver_user_id,
      );
      const existingRemovingUsersList = existingUsersList.filter(
        (userId) => !userIds.includes(userId),
      );
      if (existingRemovingUsersList.length) {
        this.pmApproversRepository.delete({
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
      const existingApprovers = await this.masterPmApproversRepository
        .createQueryBuilder('approver')
        .where('approver.masterPreventiveMaintenance = :masterPmId', {
          masterPmId,
        })
        .getRawMany();
      const existingUsersList = existingApprovers.map(
        (app) => app.approver_user_id,
      );
      const existingRemovingUsersList = existingUsersList.filter(
        (userId) => !userIds.includes(userId),
      );
      if (existingRemovingUsersList.length) {
        this.masterPmApproversRepository.delete({
          masterPreventiveMaintenance: In([masterPmId]),
          user: In(existingRemovingUsersList),
        });
      }
      const nonExistingUsers = userIds.filter(
        (userId) => !existingUsersList.includes(userId),
      );
      if (nonExistingUsers.length > 0) {
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

  async sendApproverUpdateNotification(
    user: User,
    pm: PreventiveMaintenances,
    approverId: string,
    messageText: string,
  ) {
    try {
      const { pmType, workId, workTitle, area, asset } = pm;
      const deviceIds = await this.userFcmTokenService.findFcmTokensByUserIds([
        approverId,
      ]);

      const requestUser = `${user.first_name} ${user.last_name}`;
      const message = `${requestUser} ${messageText}`;

      const notification = {
        workId,
        workTitle,
        type: pmType,
        areaId: area?.id || '',
        assetId: asset?.id || '',
        assetName: asset?.name || '',
        assetPackageName: area?.name || '',
        userId: user.id,
      };
      await Promise.all([
        this.notificationService.createPmNotification(
          // saving notifcation in the db
          pm,
          messageText,
          user.id,
          true,
          [{ id: approverId }] as any,
        ),
        this.notificationService.sendNotificationToMultipleDevices(
          // sending push notifications to the devices
          deviceIds,
          message,
          notification,
        ),
      ]);
    } catch (error) {
      console.log('error in sendApproverUpdateNotification: ', error);
    }
  }
}
