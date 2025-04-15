import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Req,
  Put,
} from '@nestjs/common';
import { ManageOrdersService } from './manage-orders.service';
import { CreateManageOrderDto } from './dto/create-manage-order.dto';
import { UpdateManageOrderDto } from './dto/update-manage-order.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateManagePartResponseDto } from './dto/create-manage-order-response.dto';
import { UpdateStatusManageOrder } from './dto/update-status-manage-order.dto';
import { GetAllManageOrdersResponseDto } from './dto/get-all-manage-orders-response.dto';
import {
  GetAllManageOrdersParamDto,
  GetAllManageOrdersQueryDto,
  SparePartHistoryTypeEnum,
} from './dto/get-manage-orders.dto';
import { UpdateQuantityManageOrder } from './dto/update-quantity-manage-order.dto';
import { BaseResponseDto } from '@common/dto/base-response.dto';
import { GetPendingItemsCountResponseDto } from './dto/get-pending-items-response.dto';
import { GetAllManageOrderHistoriesResponseDto } from './dto/get-all-manage-order-histories-response.dto';
import { RestockOrderPayload } from './dto/restock-order-payload.dto';

@ApiBearerAuth()
@ApiTags('Manage Orders')
@Controller('manage-orders')
export class ManageOrdersController {
  constructor(private readonly manageOrdersService: ManageOrdersService) {}

  @ApiOkResponse({
    type: CreateManagePartResponseDto,
  })
  @Post(':projectSparePartId')
  create(
    @Req() req,
    @Param('projectSparePartId', ParseUUIDPipe) projectSparePartId: string,
    @Body() createManageOrderDto: CreateManageOrderDto,
  ): Promise<CreateManagePartResponseDto> {
    return this.manageOrdersService.create(
      createManageOrderDto,
      projectSparePartId,
      req.user,
    );
  }

  @ApiOkResponse({
    type: CreateManagePartResponseDto,
  })
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CreateManagePartResponseDto> {
    return this.manageOrdersService.findOne(id);
  }

  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @Delete(':id')
  deleteOrder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto> {
    return this.manageOrdersService.deleteOrder(id);
  }

  @ApiOkResponse({
    type: CreateManagePartResponseDto,
  })
  @Get('spare-parts/:projectSparePartId')
  findOneBySparePart(
    @Param('projectSparePartId', ParseUUIDPipe) projectSparePartId: string,
  ): Promise<CreateManagePartResponseDto> {
    return this.manageOrdersService.findOneBySparePart(projectSparePartId);
  }

  @ApiOkResponse({
    type: GetPendingItemsCountResponseDto,
  })
  @Get('pending-item-counts/:projectSparePartId')
  pendingItemsCount(
    @Req() req,
    @Param('projectSparePartId', ParseUUIDPipe) projectSparePartId: string,
  ): Promise<GetPendingItemsCountResponseDto> {
    return this.manageOrdersService.pendingItemsCount(projectSparePartId);
  }

  @ApiOkResponse({
    type: GetAllManageOrdersResponseDto,
  })
  @Get('order-histories/:id')
  findAllHistories(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
    }: GetAllManageOrdersQueryDto,
  ): Promise<GetAllManageOrderHistoriesResponseDto> {
    return this.manageOrdersService.findAllHistories(id, orderField, orderBy, {
      page,
      limit,
      route: req.protocol + '://' + req.get('host') + req.path,
    });
  }

  @Get('draw-history/:sparePartId')
  findDrawHistoriesBySparePart(
    @Req() req,
    @Param('sparePartId', ParseUUIDPipe) sparePartId: string,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
      search = null,
    }: GetAllManageOrdersQueryDto,
  ): Promise<GetAllManageOrderHistoriesResponseDto> {
    return this.manageOrdersService.findDrawHistoriesBySparePart(
      sparePartId,
      orderField,
      orderBy,
      search,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @Get('draw-history-assets/:projectId/:assetId')
  findDrawHistoriesByAsset(
    @Req() req,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('assetId', ParseUUIDPipe) assetId: string,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
    }: GetAllManageOrdersQueryDto,
  ): Promise<GetAllManageOrderHistoriesResponseDto> {
    return this.manageOrdersService.findDrawHistoriesByAsset(
      projectId,
      assetId,
      orderField,
      orderBy,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @Get('work-order-draw-history/:pmId')
  findDrawHistoriesByWorkOrder(
    @Req() req,
    @Param('pmId', ParseUUIDPipe) pmId: string,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
    }: GetAllManageOrdersQueryDto,
  ): Promise<GetAllManageOrderHistoriesResponseDto> {
    return this.manageOrdersService.findDrawHistoriesByWorkOrder(
      pmId,
      orderField,
      orderBy,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @ApiOkResponse({
    type: GetAllManageOrdersResponseDto,
  })
  @Get(':status/:projectSparePartId')
  findAll(
    @Req() req,
    @Param() { status, projectSparePartId }: GetAllManageOrdersParamDto,

    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
    }: GetAllManageOrdersQueryDto,
  ): Promise<GetAllManageOrdersResponseDto> {
    return this.manageOrdersService.findAll(
      status,
      projectSparePartId,
      orderField,
      orderBy,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @ApiOkResponse({
    type: CreateManagePartResponseDto,
  })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateManageOrderDto: UpdateManageOrderDto,
  ): Promise<CreateManagePartResponseDto> {
    return this.manageOrdersService.update(id, updateManageOrderDto);
  }

  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @Patch('restock/:id')
  restockQuantity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateQuantityManageOrder: UpdateQuantityManageOrder,
  ): Promise<CreateManagePartResponseDto> {
    return this.manageOrdersService.restockQuantity(
      id,
      updateQuantityManageOrder,
    );
  }

  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @Patch('restock/v2/:id')
  restockQuantityV2(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() restockOrderPayload: RestockOrderPayload,
  ): Promise<BaseResponseDto> {
    return this.manageOrdersService.restockQuantityV2(
      req.user,
      id,
      restockOrderPayload,
    );
  }

  @ApiOkResponse({
    type: CreateManagePartResponseDto,
  })
  @Patch('borrow/:projectSparePartId')
  updateQuantity(
    @Req() req,
    @Param('projectSparePartId', ParseUUIDPipe) projectSparePartId: string,
    @Body() updateQuantityManageOrder: UpdateQuantityManageOrder,
  ): Promise<BaseResponseDto> {
    return this.manageOrdersService.borrowQuantity(
      req.user,
      projectSparePartId,
      updateQuantityManageOrder,
    );
  }

  @ApiOkResponse({
    type: CreateManagePartResponseDto,
  })
  @Patch('status/:id')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusManageOrder: UpdateStatusManageOrder,
  ): Promise<CreateManagePartResponseDto> {
    return this.manageOrdersService.updateStatus(id, updateStatusManageOrder);
  }
}
