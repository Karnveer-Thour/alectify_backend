import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  ParseUUIDPipe,
  Req,
  Query,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { PreventiveMaintenanceDocumentsService } from './preventive-maintenance-documents.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Folders } from './models/folders.enum';
import { CreatePreventiveMaintenanceDocumentDto } from './dto/create-preventive-maintenance-document.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { UploadFilesDto } from './dto/upload-preventive-maintenance-document.dto';
import { GetAllPreventiveMaintenanceDocumentQueryDto } from './dto/get-all-preventive-maintenance-document.dto';
import { DeletePreventiveMaintenanceDocumentDto } from './dto/delete-preventive-maintenance-document.dto';
import { RecoverAndUpdatePreventiveMaintenanceDocumentDto } from './dto/recover-preventive-maintenance-document.dto';
import {
  disAllowedExtensions,
  getFileNameFromFolders,
} from '@common/utils/utils';

@ApiBearerAuth()
@ApiTags('Preventive Maintenance Documents')
@Controller('preventive-maintenance-documents')
export class PreventiveMaintenanceDocumentsController {
  constructor(
    private readonly preventiveMaintenanceDocumentsService: PreventiveMaintenanceDocumentsService,
  ) {}

  @Put(':id')
  recoverAndUpdate(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RecoverAndUpdatePreventiveMaintenanceDocumentDto,
  ) {
    return this.preventiveMaintenanceDocumentsService.recoverAndUpdate(
      req.user,
      id,
      dto,
    );
  }

  @ApiConsumes('multipart/form-data')
  @Post(':preventiveMaintenanceId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: Folders.PM_INSTRUCTIONS },
      { name: Folders.COMMERCIAL_DOCS },
      { name: Folders.PM_REPORTS },
      { name: Folders.IMAGES },
      { name: Folders.VIDEOS },
      { name: Folders.DOCUMENT_UPLOAD },
      { name: Folders.ACTIVITY },
      { name: Folders.SUBMIT_FOR_REVIEW },
      { name: Folders.PROCEDURES },
    ]),
  )
  create(
    @Req() req,
    @Param('preventiveMaintenanceId', ParseUUIDPipe) pmId: string,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    files: UploadFilesDto,
    @Body()
    createPreventiveMaintenanceDocumentDto: CreatePreventiveMaintenanceDocumentDto,
  ) {
    const fileNames = getFileNameFromFolders(files, Folders);
    const checkFiles = disAllowedExtensions(fileNames);
    if (checkFiles.length) {
      throw new BadRequestException(
        `File type ${checkFiles[0]} is not allowed.`,
      );
    }
    return this.preventiveMaintenanceDocumentsService.create(
      req.headers.authorization,
      req.user,
      pmId,
      createPreventiveMaintenanceDocumentDto,
      files,
    );
  }

  @Get(':preventiveMaintenanceId')
  findByPmId(
    @Req() req,
    @Param('preventiveMaintenanceId', ParseUUIDPipe) pmId: string,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
      folder = null,
      search = null,
      fileType = null,
      signedUrls = null,
    }: GetAllPreventiveMaintenanceDocumentQueryDto,
  ) {
    return this.preventiveMaintenanceDocumentsService.findByPmId(
      pmId,
      folder,
      search,
      orderField,
      orderBy,
      fileType,
      signedUrls,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @Delete(':id')
  remove(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { deletedComment }: DeletePreventiveMaintenanceDocumentDto,
  ) {
    return this.preventiveMaintenanceDocumentsService.softDelete(
      req.user,
      id,
      deletedComment,
    );
  }
}
