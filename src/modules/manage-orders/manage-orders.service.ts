import { BaseResponseDto } from '@common/dto/base-response.dto';
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { AreasService } from 'modules/areas/areas.service';
import { SparePartsService } from 'modules/spare-parts/spare-parts.service';
import { User } from 'modules/users/entities/user.entity';
import { UsersService } from 'modules/users/users.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Brackets, IsNull, In } from 'typeorm';
import { AssetsService } from '../assets/assets.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateManagePartResponseDto } from './dto/create-manage-order-response.dto';
import { CreateManageOrderDto } from './dto/create-manage-order.dto';
import { GetAllManageOrderHistoriesResponseDto } from './dto/get-all-manage-order-histories-response.dto';
import { GetAllManageOrdersResponseDto } from './dto/get-all-manage-orders-response.dto';
import { GetPendingItemsCountResponseDto } from './dto/get-pending-items-response.dto';
import { UpdateManageOrderDto } from './dto/update-manage-order.dto';
import { UpdateQuantityManageOrder } from './dto/update-quantity-manage-order.dto';
import { UpdateStatusManageOrder } from './dto/update-status-manage-order.dto';
import { ManageOrderHistory } from './entities/manage-order-history.entity';
import { ManageOrder } from './entities/manage-order.entity';
import { ActivityMessages } from './models/activity-messages.enum';
import { QuantityTypes } from './models/quantity-types.enum';
import { Status } from './models/statuses.enum';
import { ManageOrdersHistoriesRepository } from './repositories/manage-orders-histories.repository';
import { ManageOrdersRepository } from './repositories/manage-orders.repository';
import { dateToUTC } from '@common/utils/utils';
import { RestockOrderPayload } from './dto/restock-order-payload.dto';
import { SparePartHistoryTypeEnum } from './dto/get-manage-orders.dto';
import { PreventiveMaintenancesService } from 'modules/preventive-maintenances/preventive-maintenances.service';
import { CommentsMessages } from 'modules/comments/models/comments-messages';

@Injectable()
export class ManageOrdersService {
  constructor(
    private manageOrdersRepository: ManageOrdersRepository,
    private manageOrdersHistoriesRepository: ManageOrdersHistoriesRepository,
    @Inject(forwardRef(() => SparePartsService))
    private sparePartsService: SparePartsService,
    private projectsService: ProjectsService,
    private assetsService: AssetsService,
    private readonly usersService: UsersService,
    private areaService: AreasService,
    @Inject(forwardRef(() => PreventiveMaintenancesService))
    private preventiveMaintenanceService: PreventiveMaintenancesService,
  ) {}
  async create(
    createManageOrderDto: CreateManageOrderDto,
    projectSparePartId: string,
    user: User,
  ) {
    try {
      const projectSparePart = await this.sparePartsService.findById(
        projectSparePartId,
      );
      const existingOrder = await this.manageOrdersRepository.findOne({
        where: {
          projectSparePart: { id: projectSparePartId },
          completedAt: IsNull(),
        },
      });
      if (!projectSparePart) {
        throw new NotFoundException('Spare part does not exist');
      }
      const project = await this.projectsService.findOneById(
        createManageOrderDto.projectId,
      );

      let order: ManageOrder;

      if (!existingOrder) {
        const orderId = await this.getOrderId(
          project.id,
          projectSparePart.sparePart.partNumber,
          projectSparePart.id,
        );

        order = await this.manageOrdersRepository.save(
          new ManageOrder({
            ...createManageOrderDto,
            orderId: orderId,
            project: project,
            projectSparePart: projectSparePart,
            remainingQuantity: createManageOrderDto.quantity,
            createdAt: dateToUTC(),
            orderedDate: createManageOrderDto.orderedDate
              ? dateToUTC(createManageOrderDto.orderedDate)
              : null,
            orderedBy: user.id as any,
          }),
        );
      } else {
        const newPendingOrdersCount =
          createManageOrderDto.quantity - existingOrder.quantity;
        order = await this.manageOrdersRepository.save(
          new ManageOrder({
            id: existingOrder.id,
            quantity: createManageOrderDto.quantity,
            unitPrice: createManageOrderDto.unitPrice,
            remainingQuantity:
              existingOrder.remainingQuantity + newPendingOrdersCount,
            updatedAt: dateToUTC(),
            orderedDate: createManageOrderDto.orderedDate
              ? dateToUTC(createManageOrderDto.orderedDate)
              : null,
            orderedBy: user.id as any,
            comments: createManageOrderDto.comments,
          }),
        );
      }

      await this.manageOrdersHistoriesRepository.save(
        new ManageOrderHistory({
          project: project,
          projectSparePart: projectSparePart,
          manageOrder: order,
          price: createManageOrderDto.unitPrice,
          quantity: createManageOrderDto.quantity,
          quantityType: QuantityTypes.ORDER,
          activity: existingOrder
            ? ActivityMessages.ORDER_UPDATED
            : ActivityMessages.ORDER_CREATED,
          lastSparePartQuantity: projectSparePart.remainingQuantity,
          comments: createManageOrderDto.comments,
          user: user.id as any,
          createdAt: dateToUTC(),
        }),
      );
      return {
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    status: Status,
    projectSparePartId: string,
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    options: IPaginationOptions,
  ): Promise<GetAllManageOrdersResponseDto> {
    try {
      const manageOrders = this.manageOrdersRepository
        .createQueryBuilder('mo')
        .leftJoinAndSelect('mo.project', 'project')
        .where('mo.projectSparePart =:projectSparePartId', {
          projectSparePartId,
        });

      if (status === Status.PENDING) {
        manageOrders.andWhere('mo.completedAt IS NULL');
      }

      if (status === Status.COMPLETED) {
        manageOrders.andWhere('mo.completedAt IS NOT NULL');
      }

      manageOrders.orderBy('mo.created_at', 'DESC');

      const { items, meta, links } = await paginate<ManageOrder>(
        manageOrders,
        options,
      );
      return {
        message: 'Get all manage orders successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllHistories(
    id: string,
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    options: IPaginationOptions,
  ): Promise<GetAllManageOrderHistoriesResponseDto> {
    try {
      const manageOrdersHistories = this.manageOrdersHistoriesRepository
        .createQueryBuilder('moh')
        .leftJoinAndSelect('moh.project', 'project')
        .leftJoinAndSelect('moh.subProject', 'subProject')
        .leftJoinAndSelect('moh.asset', 'asset')
        .leftJoinAndSelect('moh.area', 'area')
        .leftJoinAndSelect('moh.user', 'user')
        .leftJoinAndSelect('moh.projectSparePart', 'projectSparePart')
        .leftJoinAndSelect('projectSparePart.sparePart', 'sparePart')
        .leftJoinAndSelect(
          'projectSparePart.projectSparePartCategory',
          'projectSparePartCategory',
        )
        .leftJoinAndSelect(
          'projectSparePartCategory.sparePartCategory',
          'sparePartCategory',
        )
        .where('moh.manageOrder =:id', {
          id,
        });

      manageOrdersHistories.orderBy('moh.created_at', 'DESC');

      const { items, meta, links } = await paginate<ManageOrderHistory>(
        manageOrdersHistories,
        options,
      );
      return {
        message: 'Get all manage orders histories successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async findDrawHistoriesByAsset(
    projectId: string,
    assetId: string,
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    options: IPaginationOptions,
  ): Promise<GetAllManageOrderHistoriesResponseDto> {
    try {
      const manageOrdersHistories = this.manageOrdersHistoriesRepository
        .createQueryBuilder('moh')
        .leftJoinAndSelect('moh.project', 'project')
        .leftJoinAndSelect('moh.subProject', 'subProject')
        .leftJoinAndSelect('moh.asset', 'asset')
        .leftJoinAndSelect('moh.area', 'area')
        .leftJoinAndSelect('moh.user', 'user')
        .leftJoinAndSelect('moh.projectSparePart', 'projectSparePart')
        .leftJoinAndSelect('projectSparePart.sparePart', 'sparePart')
        .leftJoinAndSelect(
          'projectSparePart.projectSparePartCategory',
          'projectSparePartCategory',
        )
        .leftJoinAndSelect(
          'projectSparePartCategory.sparePartCategory',
          'sparePartCategory',
        )
        .where('project.id =:projectId', { projectId })
        .andWhere('asset.id =:assetId', {
          assetId,
        })
        .andWhere('moh.quantityType =:quantityType', {
          quantityType: QuantityTypes.BORROW,
        });

      manageOrdersHistories.orderBy('moh.created_at', 'DESC');

      const { items, meta, links } = await paginate<ManageOrderHistory>(
        manageOrdersHistories,
        options,
      );
      return {
        message: 'Get all manage orders histories successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async findDrawHistoriesByWorkOrder(
    pmId: string,
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    options: IPaginationOptions,
  ): Promise<GetAllManageOrderHistoriesResponseDto> {
    try {
      const manageOrdersHistories = this.manageOrdersHistoriesRepository
        .createQueryBuilder('moh')
        .leftJoinAndSelect('moh.preventiveMaintenance', 'pm')
        .where('pm.id =:pmId', { pmId })
        .leftJoinAndSelect('moh.project', 'project')
        .leftJoinAndSelect('moh.subProject', 'subProject')
        .leftJoinAndSelect('moh.asset', 'asset')
        .leftJoinAndSelect('moh.area', 'area')
        .leftJoinAndSelect('moh.user', 'user')
        .leftJoinAndSelect('moh.projectSparePart', 'projectSparePart')
        .leftJoinAndSelect('projectSparePart.sparePart', 'sparePart')
        .leftJoinAndSelect(
          'projectSparePart.preferredSupplier',
          'preferredSupplier',
        )
        .leftJoinAndSelect(
          'projectSparePart.projectSparePartCategory',
          'projectSparePartCategory',
        )
        .leftJoinAndSelect(
          'projectSparePartCategory.sparePartCategory',
          'sparePartCategory',
        )
        .orderBy('moh.created_at', 'DESC');

      const { items, meta, links } = await paginate<ManageOrderHistory>(
        manageOrdersHistories,
        options,
      );
      return {
        message: 'Get work order manage orders histories successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async findDrawHistoriesBySparePart(
    sparePartId: string,
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    search: string,
    options: IPaginationOptions,
  ): Promise<GetAllManageOrderHistoriesResponseDto> {
    try {
      const manageOrdersHistories = this.manageOrdersHistoriesRepository
        .createQueryBuilder('moh')
        .where('projectSparePart.id =:sparePartId', { sparePartId })
        .leftJoinAndSelect('moh.project', 'project')
        .leftJoinAndSelect('moh.subProject', 'subProject')
        .leftJoinAndSelect('moh.asset', 'asset')
        .leftJoinAndSelect('moh.area', 'area')
        .leftJoinAndSelect('moh.user', 'user')
        .leftJoinAndSelect('moh.projectSparePart', 'projectSparePart')
        .leftJoinAndSelect('projectSparePart.sparePart', 'sparePart')
        .leftJoinAndSelect(
          'projectSparePart.projectSparePartCategory',
          'projectSparePartCategory',
        )
        .leftJoinAndSelect('moh.manageOrder', 'manageOrder')
        .leftJoinAndSelect(
          'projectSparePartCategory.sparePartCategory',
          'sparePartCategory',
        );

      if (search) {
        manageOrdersHistories.andWhere(
          new Brackets((qb) => {
            qb.where('manageOrder.poNumber ILIKE :search', {
              search: `%${search}%`,
            }).orWhere('moh.activity::text ILIKE :search', {
              search: `%${search}%`,
            });
          }),
        );
      }
      manageOrdersHistories.orderBy('moh.created_at', 'DESC');
      const { items, meta, links } = await paginate<ManageOrderHistory>(
        manageOrdersHistories,
        options,
      );
      return {
        message: 'Get all manage orders histories successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<CreateManagePartResponseDto> {
    try {
      const manageOrder = await this.manageOrdersRepository
        .createQueryBuilder('mo')
        .leftJoinAndSelect('mo.project', 'project')
        .where('mo.id =:id', {
          id,
        })
        .getOne();

      if (!manageOrder) {
        throw new NotFoundException('Order does not exist');
      }

      return {
        message: 'Get manage order successfully',
        data: manageOrder,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<BaseResponseDto> {
    await this.manageOrdersRepository.save(
      new ManageOrder({
        id,
        deletedAt: dateToUTC(),
      }),
    );
    return {
      message: 'Order deleted successfully',
    };
  }

  async findOneBySparePart(
    projectSparePartId: string,
  ): Promise<CreateManagePartResponseDto> {
    try {
      const manageOrder = await this.manageOrdersRepository
        .createQueryBuilder('mo')
        .leftJoinAndSelect('mo.project', 'project')
        .leftJoinAndSelect('mo.projectSparePart', 'projectSparePart')
        .where('projectSparePart.id =:projectSparePartId', {
          projectSparePartId,
        })
        .andWhere('mo.completedAt IS NULL')
        .getOne();

      if (!manageOrder) {
        throw new NotFoundException('Order does not exist');
      }

      return {
        message: 'Get manage order successfully',
        data: manageOrder,
      };
    } catch (error) {
      throw error;
    }
  }

  async pendingItemsCount(
    projectSparePartId: string,
  ): Promise<GetPendingItemsCountResponseDto> {
    try {
      const pendingItems = await this.manageOrdersRepository
        .createQueryBuilder('mo')
        .leftJoinAndSelect('mo.project', 'project')
        .where('mo.projectSparePart =:projectSparePartId', {
          projectSparePartId,
        })
        .select('SUM(mo.remainingQuantity)', 'pendingItems')
        .getRawOne();

      return {
        message: 'Get pending items count successfully',
        data: pendingItems,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateManageOrderDto: UpdateManageOrderDto,
  ): Promise<CreateManagePartResponseDto> {
    try {
      const isExist = await this.manageOrdersRepository
        .createQueryBuilder('mo')
        .leftJoinAndSelect('mo.project', 'project')
        .leftJoinAndSelect('mo.projectSparePart', 'projectSparePart')
        .where('mo.id =:id', {
          id,
        })
        .getOne();

      if (!isExist) {
        throw new NotFoundException('Order does not exist');
      }
      let remainingQuantity = isExist.remainingQuantity;
      if (updateManageOrderDto.quantity !== isExist.quantity) {
        remainingQuantity =
          updateManageOrderDto.quantity - isExist.quantity + remainingQuantity;
      }
      const order = await this.manageOrdersRepository.save(
        new ManageOrder({
          ...isExist,
          ...updateManageOrderDto,
          remainingQuantity,
          estimatedDate: dateToUTC(updateManageOrderDto.estimatedDate),
          orderedDate: updateManageOrderDto.orderedDate
            ? dateToUTC(updateManageOrderDto.orderedDate)
            : null,
        }),
      );
      await this.manageOrdersHistoriesRepository.save(
        new ManageOrderHistory({
          project: isExist.project,
          projectSparePart: isExist.projectSparePart,
          manageOrder: order,
          quantity: updateManageOrderDto.quantity,
          quantityType: QuantityTypes.RESTOCK,
          activity: ActivityMessages.ORDER_UPDATED,
          lastSparePartQuantity: isExist.projectSparePart.remainingQuantity,
          comments: updateManageOrderDto.comments,
          createdAt: dateToUTC(),
        }),
      );

      return {
        message: 'Order updated successfully',
        data: order,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(
    id: string,
    updateStatusManageOrder: UpdateStatusManageOrder,
  ): Promise<CreateManagePartResponseDto> {
    try {
      const isExist = await this.manageOrdersRepository
        .createQueryBuilder('mo')
        .leftJoinAndSelect('mo.project', 'project')
        .leftJoinAndSelect('mo.projectSparePart', 'projectSparePart')
        .where('mo.id =:id', {
          id,
        })
        .getOne();

      if (!isExist) {
        throw new NotFoundException('Order does not exist');
      }
      const order = await this.manageOrdersRepository.save(
        new ManageOrder({
          ...isExist,
          completedAt: dateToUTC(updateStatusManageOrder.date),
        }),
      );
      await this.manageOrdersHistoriesRepository.save(
        new ManageOrderHistory({
          project: isExist.project,
          projectSparePart: isExist.projectSparePart,
          manageOrder: order,
          quantity: 0,
          quantityType: QuantityTypes.RESTOCK,
          activity: ActivityMessages.ORDER_COMPLETED,
          lastSparePartQuantity: isExist.projectSparePart.remainingQuantity,
        }),
      );
      return {
        message: 'Order updated successfully',
        data: order,
      };
    } catch (error) {
      throw error;
    }
  }

  async restockQuantity(
    id: string,
    updateQuantityManageOrder: UpdateQuantityManageOrder,
  ): Promise<CreateManagePartResponseDto> {
    try {
      const isExist = await this.manageOrdersRepository
        .createQueryBuilder('mo')
        .leftJoinAndSelect('mo.projectSparePart', 'projectSparePart')
        .where('mo.id =:id', {
          id,
        })
        .getOne();

      if (!isExist) {
        throw new NotFoundException('Order does not exist');
      }

      const manageOrder = await this.manageOrdersRepository.save(
        new ManageOrder({
          ...isExist,
          remainingQuantity:
            isExist.remainingQuantity - updateQuantityManageOrder.quantity,
        }),
      );

      await this.sparePartsService.updateQuantity(
        isExist.projectSparePart.id,
        updateQuantityManageOrder.quantity,
      );

      await this.manageOrdersHistoriesRepository.save(
        new ManageOrderHistory({
          project: isExist.project,
          projectSparePart: isExist.projectSparePart,
          manageOrder: isExist,
          quantity: updateQuantityManageOrder.quantity,
          quantityType: QuantityTypes.RESTOCK,
          activity: ActivityMessages.ITEMS_RECEIVED,
          lastSparePartQuantity: isExist.projectSparePart.remainingQuantity,
          comments: updateQuantityManageOrder.comments,
          createdAt: dateToUTC(),
        }),
      );

      return {
        message: 'Quantity updated successfully',
        data: manageOrder,
      };
    } catch (error) {
      throw error;
    }
  }

  async restockQuantityV2(
    user: User,
    projectSparePartId: string,
    restockOrderPayload: RestockOrderPayload,
  ): Promise<BaseResponseDto> {
    try {
      user = await this.usersService.findOneById(user.id);
      const projectSparePart = await this.sparePartsService.findById(
        projectSparePartId,
      );

      if (!projectSparePart) {
        throw new NotFoundException('Spare part does not exist');
      }

      await this.sparePartsService.updateQuantityAndPrice(
        projectSparePartId,
        restockOrderPayload.quantity,
        restockOrderPayload.price,
      );

      const order = await this.manageOrdersRepository.findOne({
        where: { id: restockOrderPayload.manageOrderId },
      });

      const orderPendingQuantity =
        order.remainingQuantity - restockOrderPayload.restockQty;

      await this.manageOrdersHistoriesRepository.save(
        new ManageOrderHistory({
          ...restockOrderPayload,
          manageOrder: restockOrderPayload.manageOrderId as any,
          quantity: restockOrderPayload.restockQty,
          project: projectSparePart.project.id as any,
          projectSparePart: projectSparePart,
          quantityType: QuantityTypes.RESTOCK,
          activity:
            orderPendingQuantity === 0
              ? ActivityMessages.ORDER_COMPLETED
              : ActivityMessages.ITEMS_RECEIVED,
          lastSparePartQuantity: projectSparePart.remainingQuantity,
          user: user.id as any,
          createdAt: dateToUTC(),
          comments: restockOrderPayload.comments,
        }),
      );

      await this.manageOrdersRepository.save(
        new ManageOrder({
          id: order.id,
          updatedAt: dateToUTC(),
          completedAt: orderPendingQuantity === 0 ? dateToUTC() : null,
          remainingQuantity: orderPendingQuantity,
        }),
      );

      // if (orderPendingQuantity === 0) {
      //   await this.manageOrdersHistoriesRepository.save(
      //     new ManageOrderHistory({
      //       ...restockOrderPayload,
      //       manageOrder: restockOrderPayload.manageOrderId as any,
      //       quantity: restockOrderPayload.restockQty,
      //       project: projectSparePart.project.id as any,
      //       projectSparePart: projectSparePart,
      //       quantityType: QuantityTypes.RESTOCK,
      //       activity: ActivityMessages.ORDER_COMPLETED,
      //       lastSparePartQuantity: projectSparePart.remainingQuantity,
      //       user: user.id as any,
      //       createdAt: dateToUTC(),
      //     }),
      //   );
      // }

      // ocy 22 + 30
      return {
        message: 'Restock successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async borrowQuantity(
    user: User,
    projectSparePartId: string,
    updateQuantityManageOrder: UpdateQuantityManageOrder,
  ): Promise<BaseResponseDto> {
    try {
      user = await this.usersService.findOneById(user.id);
      const projectSparePart = await this.sparePartsService.findById(
        projectSparePartId,
      );

      if (!projectSparePart) {
        throw new NotFoundException('Spare part does not exist');
      }

      const project = await this.projectsService.findOneById(
        updateQuantityManageOrder.projectId,
      );

      const subProject = await this.projectsService.findOneByIdSubProject(
        updateQuantityManageOrder.subProjectId,
      );
      let asset = null;
      if (updateQuantityManageOrder.assetId) {
        asset = await this.assetsService.findOneById(
          updateQuantityManageOrder.assetId,
        );
      }
      let area = null;
      if (updateQuantityManageOrder.areaId) {
        area = await this.areaService.findOneById(
          updateQuantityManageOrder.areaId,
        );
      }

      this.sparePartsService.updateQuantity(
        projectSparePartId,
        -1 * updateQuantityManageOrder.quantity,
      );

      await this.manageOrdersHistoriesRepository.save(
        new ManageOrderHistory({
          ...updateQuantityManageOrder,
          asset: asset,
          area: area,
          project: project,
          subProject: subProject,
          projectSparePart: projectSparePart,
          quantityType: QuantityTypes.BORROW,
          activity: ActivityMessages.ITEMS_DRAWN,
          lastSparePartQuantity: projectSparePart.remainingQuantity,
          user: user,
          preventiveMaintenance:
            (updateQuantityManageOrder?.preventiveMaintenanceId as any) ?? null,
          price: projectSparePart.price,
          createdAt: dateToUTC(),
        }),
      );

      if (updateQuantityManageOrder?.preventiveMaintenanceId) {
        // send notification
        const pm =
          await this.preventiveMaintenanceService.findOneByIdWithoutRelations(
            updateQuantityManageOrder?.preventiveMaintenanceId,
          );
        await this.preventiveMaintenanceService.sendTaskUpdateNotificationsQueue(
          pm,
          user,
          CommentsMessages.DRWAN_SPARE_PARTS.replace(
            '{qty}',
            updateQuantityManageOrder.quantity.toString(),
          ).replace('{sparePartName}', projectSparePart.sparePart.partNumber),
        );
      }

      return {
        message: 'Quantity updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteByProjectSparePart(projectSparePart): Promise<BaseResponseDto> {
    try {
      await this.manageOrdersHistoriesRepository.delete({
        projectSparePart,
      });
      await this.manageOrdersRepository.delete({
        projectSparePart,
      });
      return {
        message: 'Manage order deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  private async getOrderId(
    projectId: string,
    partNumber: string,
    projectSparePartId: string,
  ) {
    try {
      const defaultOrderId = partNumber + '-' + '1'.padStart(6, '0');
      const lastRecord = await this.manageOrdersRepository.findLastRecord(
        projectId,
        projectSparePartId,
      );
      if (lastRecord) {
        const orderId = lastRecord?.orderId;
        if (!orderId) {
          return defaultOrderId;
        }
        const count = orderId.split(partNumber + '-')[1].replace(/\b0+/g, '');
        const newCount = Number(count) + 1;
        return partNumber + '-' + newCount.toString().padStart(6, '0');
      }
      return defaultOrderId;
    } catch (error) {
      throw error;
    }
  }

  async getPmSparePartOrdersHistorySummary(
    pmId: string,
  ): Promise<{ count: number; cost: number }> {
    const result = await this.manageOrdersHistoriesRepository
      .createQueryBuilder('moh')
      .leftJoinAndSelect('moh.preventiveMaintenance', 'pm')
      .where('pm.id = :pmId', { pmId })
      .select([
        'COUNT(moh.id) AS count',
        'SUM(COALESCE(moh.price, 0) * moh.quantity) AS cost',
      ])
      .getRawOne();

    return {
      cost: parseFloat(result.cost),
      count: parseInt(result.count, 10),
    };
  }

  async deleteByPM(preventiveMaintenance): Promise<BaseResponseDto> {
    try {
      await this.manageOrdersHistoriesRepository.delete({
        preventiveMaintenance: preventiveMaintenance.id,
      });
      return {
        message: 'Manage order deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
