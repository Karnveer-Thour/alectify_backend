import { BaseResponseDto } from '@common/dto/base-response.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateManySparePartsDto } from './dto/create-many-spare-part.dto';
import { CreateSparePartResponseDto } from './dto/create-spare-part-response.dto';
import { CreateSparePartDto } from './dto/create-spare-part.dto';
import { GetAllSparePartsResponseDto } from './dto/get-all-spare-parts-response.dto';
import {
  GetAllSparePartsQueryDto,
  GetSparePartStatsDto,
} from './dto/get-all-spare-parts.dto';
import { GetSparePartCategoriesResponseDto } from './dto/get-project-spare-part-categories-response.dto';
import { UpdateSparePartDto } from './dto/update-spare-part.dto';
import { SparePartsService } from './spare-parts.service';
import { DeleteSparePartDto } from './dto/delete-spare-part.dto';
import { GetSparePartPreferredSuppliersResponseDto } from './dto/get-project-spare-part-preferred-suppliers-response.dto';
import {
  SparePartDashboardMonthlyHistoryResponseDto,
  SparePartDashboardStatsResponseDto,
  SparePartsMonthlyCostResponse,
} from './dto/get-dasboard-spare-parts-stats.dto';
import { disAllowedExtensions } from '@common/utils/utils';
import { GetAdvisorySummariesResponseDto } from './dto/get-advisory-summaries-response.dto';

@ApiBearerAuth()
@ApiTags('Spare Parts')
@Controller('spare-parts')
export class SparePartsController {
  constructor(private readonly sparePartsService: SparePartsService) {}

  @ApiOkResponse({
    type: CreateSparePartResponseDto,
  })
  @Post()
  create(
    @Body() createSparePartDto: CreateSparePartDto,
  ): Promise<CreateSparePartResponseDto> {
    return this.sparePartsService.create(createSparePartDto);
  }

  @ApiOkResponse({
    type: GetSparePartCategoriesResponseDto,
  })
  @Get('categories')
  findAllCategories(
    @Req() req,
    @Query()
    { projectId = null }: GetSparePartStatsDto,
  ): Promise<GetSparePartCategoriesResponseDto> {
    return this.sparePartsService.findAllCategories(
      req.headers.authorization,
      req.user,
      projectId,
    );
  }

  @ApiOkResponse({
    type: GetAdvisorySummariesResponseDto,
  })
  @Get('advisory-summaries')
  getAdvisorySummaries(
    @Req() req,
    @Query('projectId') projectId?: string,
  ): Promise<GetAdvisorySummariesResponseDto> {
    return this.sparePartsService.getAdvisorySummaries(req.user, projectId);
  }

  @ApiOkResponse({
    type: GetSparePartPreferredSuppliersResponseDto,
  })
  @Get('preferred-suppliers')
  findAllPreferredSuppliers(
    @Req() req,
    @Query()
    { projectId = null }: GetSparePartStatsDto,
  ): Promise<GetSparePartPreferredSuppliersResponseDto> {
    return this.sparePartsService.findAllPreferredSuppliers(
      req.headers.authorization,
      req.user,
      projectId,
    );
  }

  @ApiOkResponse({
    type: GetAllSparePartsResponseDto,
  })
  @Get('')
  findAll(
    @Req() req,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
      categoryId = null,
      partNumber = null,
      description = null,
      preferredSupplierId = null,
      preferredSupplierName = null,
      system = null,
      projectId = null,
      search = null,
      status = null,
      pendingOrdersOnly = null,
    }: GetAllSparePartsQueryDto,
  ): Promise<GetAllSparePartsResponseDto> {
    return this.sparePartsService.findAll(
      req.headers.authorization,
      req.user,
      categoryId,
      orderField,
      orderBy,
      partNumber,
      description,
      preferredSupplierId,
      preferredSupplierName,
      system,
      projectId,
      status,
      search,
      pendingOrdersOnly,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @ApiOkResponse({
    type: GetAllSparePartsResponseDto,
  })
  @Get('global')
  findAllByBranch(
    @Req() req,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
      categoryId = null,
      partNumber = null,
      description = null,
      preferredSupplierId = null,
      preferredSupplierName = null,
      system = null,
      search = null,
      status = null,
      projectId = null,
    }: GetAllSparePartsQueryDto,
  ): Promise<GetAllSparePartsResponseDto> {
    return this.sparePartsService.findAllByBranch(
      req.user,
      projectId,
      categoryId,
      orderField,
      orderBy,
      partNumber,
      description,
      preferredSupplierId,
      preferredSupplierName,
      system,
      status,
      search,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @Get('download')
  downloadProjectSparePartsAsCsv(
    @Req() req,
    @Res() res,
    @Query()
    { projectId = null }: GetSparePartStatsDto,
  ) {
    return this.sparePartsService.downloadProjectSparePartsAsCsv(
      res,
      projectId,
      req.headers.authorization,
      req.user,
    );
  }

  @ApiOkResponse({
    type: CreateSparePartResponseDto,
  })
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CreateSparePartResponseDto> {
    return this.sparePartsService.findOne(id);
  }

  @ApiOkResponse({
    type: GetAllSparePartsResponseDto,
  })
  @Get('find-parts/:id')
  findPartsById(
    @Req() req,
    @Query()
    { limit = 10, page = 1 }: GetAllSparePartsQueryDto,
    @Param('id') id: string,
  ): Promise<GetAllSparePartsResponseDto> {
    return this.sparePartsService.findPartsById(
      req.headers.authorization,
      req.user,
      id,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @ApiOkResponse({
    type: GetSparePartCategoriesResponseDto,
  })
  @Get('categories/:projectId')
  findAllCategoriesByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<GetSparePartCategoriesResponseDto> {
    return this.sparePartsService.findAllCategoriesByProject(projectId);
  }

  @ApiOkResponse({
    type: GetAllSparePartsResponseDto,
  })
  @Get('project-wise/:projectId')
  findAllByProject(
    @Req() req,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
      categoryId = null,
      partNumber = null,
      description = null,
      preferredSupplierName = null,
      system = null,
    }: GetAllSparePartsQueryDto,
  ): Promise<GetAllSparePartsResponseDto> {
    return this.sparePartsService.findAllByProject(
      req.user,
      projectId,
      categoryId,
      orderField,
      orderBy,
      partNumber,
      description,
      preferredSupplierName,
      system,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @ApiOkResponse({
    type: GetAllSparePartsResponseDto,
  })
  @Get('asset-wise/:projectId/:assetId')
  findAllByAsset(
    @Req() req,
    @Param('assetId', ParseUUIDPipe) assetId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
      categoryId = null,
      partNumber = null,
      description = null,
      preferredSupplierName = null,
      system = null,
    }: GetAllSparePartsQueryDto,
  ): Promise<GetAllSparePartsResponseDto> {
    return this.sparePartsService.findAllByAsset(
      req.user,
      projectId,
      assetId,
      categoryId,
      orderField,
      orderBy,
      partNumber,
      description,
      preferredSupplierName,
      system,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @ApiOkResponse({
    type: CreateSparePartResponseDto,
  })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSparePartDto: UpdateSparePartDto,
  ): Promise<CreateSparePartResponseDto> {
    return this.sparePartsService.update(id, updateSparePartDto);
  }

  @ApiOkResponse({
    type: CreateSparePartResponseDto,
  })
  @Patch('image/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateImage(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() uploadedImage: Express.Multer.File,
  ): Promise<CreateSparePartResponseDto> {
    if (uploadedImage) {
      const checkFiles = disAllowedExtensions([uploadedImage.originalname]);
      if (checkFiles.length) {
        throw new BadRequestException(
          `File type ${checkFiles[0]} is not allowed.`,
        );
      }
    }
    return this.sparePartsService.updateImage(
      req.user,
      req.headers.authorization,
      id,
      uploadedImage,
    );
  }

  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<BaseResponseDto> {
    return this.sparePartsService.remove(id);
  }

  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @Post('create-many')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file to upload containing spare parts data',
    type: CreateManySparePartsDto,
  })
  createManyWithCSV(
    @Req() req,
    @Body() createManySparePartsDto: CreateManySparePartsDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponseDto> {
    return this.sparePartsService.createManyWithCSV(
      createManySparePartsDto,
      file,
    );
  }

  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @Delete()
  deleteMany(
    @Req() req,
    @Body() deleteSparePart: DeleteSparePartDto,
  ): Promise<BaseResponseDto> {
    return this.sparePartsService.deleteSparePart(deleteSparePart);
  }

  @ApiOkResponse({
    type: SparePartDashboardStatsResponseDto,
  })
  @Get('dashboard/stats')
  getSparePartsStats(
    @Req() req,
    @Query()
    { projectId = null, startDate, endDate }: GetSparePartStatsDto,
  ): Promise<SparePartDashboardStatsResponseDto> {
    return this.sparePartsService.getSparePartStats(
      projectId,
      req.headers.authorization,
      req.user,
      startDate,
      endDate,
    );
  }

  @ApiOkResponse({
    type: SparePartDashboardMonthlyHistoryResponseDto,
  })
  @Get('dashboard/monthly-counts-history')
  getMonthlyHistoryCounts(
    @Req() req,
    @Query()
    { projectId = null }: GetSparePartStatsDto,
  ): Promise<SparePartDashboardMonthlyHistoryResponseDto> {
    return this.sparePartsService.getMonthlyHistoryCounts(
      projectId,
      req.headers.authorization,
      req.user,
    );
  }

  @ApiOkResponse({
    type: SparePartsMonthlyCostResponse,
  })
  @Get('dashboard/monthly-cost-history')
  getCurrentYearMonthlyCost(
    @Req() req,
    @Query()
    { projectId = null }: GetSparePartStatsDto,
  ): Promise<SparePartsMonthlyCostResponse> {
    return this.sparePartsService.getCurrentYearMonthlyTotalPrice(
      projectId,
      req.headers.authorization,
      req.user,
    );
  }
}
