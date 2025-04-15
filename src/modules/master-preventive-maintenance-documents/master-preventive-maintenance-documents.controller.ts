import {
  disAllowedExtensions,
  getFileNameFromFolders,
} from '@common/utils/utils';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  CreateMasterPreventiveMaintenanceDocumentDto,
  CreateMasterPreventiveMaintenanceUploadDto,
} from './dto/create-master-preventive-maintenance-document.dto';
import { GetAllMasterPreventiveMaintenanceDocumentQueryDto } from './dto/get-all-master--preventive-maintenance-document.dto';
import { MasterPreventiveMaintenanceDocumentsService } from './master-preventive-maintenance-documents.service';

@ApiBearerAuth()
@ApiTags('Master Preventive Maintenance Documents')
@Controller('master-preventive-maintenance-documents')
export class MasterPreventiveMaintenanceDocumentsController {
  constructor(
    private readonly mpmDocumentsService: MasterPreventiveMaintenanceDocumentsService,
  ) {}

  @Get('images/:masterPreventiveMaintenanceId')
  findImagesByMasterPmId(
    @Req() req,
    @Param('masterPreventiveMaintenanceId', ParseUUIDPipe) mpmId: string,
    @Query()
    { limit = 10, page = 1 }: GetAllMasterPreventiveMaintenanceDocumentQueryDto,
  ) {
    return this.mpmDocumentsService.findImagesByMasterPmId(mpmId, {
      page,
      limit,
      route: req.protocol + '://' + req.get('host') + req.path,
    });
  }

  @Get('files/:masterPreventiveMaintenanceId')
  findFilesByMasterPmId(
    @Req() req,
    @Param('masterPreventiveMaintenanceId', ParseUUIDPipe) mpmId: string,
    @Query()
    {
      search = null,
      limit = 10,
      page = 1,
      signedUrls = false,
    }: GetAllMasterPreventiveMaintenanceDocumentQueryDto,
  ) {
    return this.mpmDocumentsService.findFilesByMasterPmId(
      mpmId,
      search,
      signedUrls,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @ApiConsumes('multipart/form-data')
  @Post(':masterPreventiveMaintenanceId')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images' }, { name: 'files' }]),
  )
  create(
    @Req() req,
    @Param('masterPreventiveMaintenanceId', ParseUUIDPipe) pmId: string,
    @UploadedFiles()
    documents: CreateMasterPreventiveMaintenanceUploadDto,
    @Body()
    createPreventiveMaintenanceDocumentDto: CreateMasterPreventiveMaintenanceDocumentDto,
  ) {
    const fileNames = getFileNameFromFolders(documents, ['images', 'files']);
    const checkFiles = disAllowedExtensions(fileNames);
    if (checkFiles.length) {
      throw new BadRequestException(
        `File type ${checkFiles[0]} is not allowed.`,
      );
    }
    return this.mpmDocumentsService.create(
      req.headers.authorization,
      req.user,
      pmId,
      createPreventiveMaintenanceDocumentDto,
      documents,
    );
  }

  @Delete('images/:masterPreventiveMaintenanceId')
  removeImages(
    @Req() req,
    @Param('masterPreventiveMaintenanceId', ParseUUIDPipe)
    masterPreventiveMaintenanceId: string,
  ) {
    return this.mpmDocumentsService.deleteImagesByIds(req.user, [
      masterPreventiveMaintenanceId,
    ]);
  }

  @Delete('files/:masterPreventiveMaintenanceId')
  removeFiles(
    @Req() req,
    @Param('masterPreventiveMaintenanceId', ParseUUIDPipe)
    masterPreventiveMaintenanceId: string,
  ) {
    return this.mpmDocumentsService.deleteImagesByIds(req.user, [
      masterPreventiveMaintenanceId,
    ]);
  }
}
