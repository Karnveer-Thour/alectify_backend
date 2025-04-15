import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  GetAllDocumentsResponseDto,
  GetAllDocumentsViewResponseDto,
  GetDocumentsViewCountResponseDto,
} from './dto/get-all-documents-response.dto';
import { GetAllDocumentsQueryDto } from './dto/get-documents.dto';
import { DocumentsService } from './documents.service';
import { RecoverAndUpdateDocumentDto } from './dto/recover-document.dto';
import { Folders } from './models/folders.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadFilesDto } from './dto/upload-document.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DeleteDocumentDto } from './dto/delete-document.dto';
import {
  disAllowedExtensions,
  getFileNameFromFolders,
} from '@common/utils/utils';

@ApiBearerAuth()
@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(':id')
  findAllDocumentsByAssetOrArea(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
      search = null,
      isActive = null,
      types = null,
    }: GetAllDocumentsQueryDto,
  ): Promise<GetAllDocumentsViewResponseDto> {
    return this.documentsService.findAllDocumentsByAssetOrArea(
      id,
      orderField,
      orderBy,
      types,
      search,
      isActive,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @Get('counts/:id')
  findAllDocumentsByAssetOrAreaCount(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Query()
    { isActive = null, types = null }: GetAllDocumentsQueryDto,
  ): Promise<GetDocumentsViewCountResponseDto> {
    return this.documentsService.countsDocumentByAssetOrArea(
      id,
      types,
      isActive,
    );
  }

  @Get('all/:id')
  findAllDocumentsByAssetOrAreaOrSubProject(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
      search = null,
    }: GetAllDocumentsQueryDto,
  ): Promise<GetAllDocumentsResponseDto> {
    return this.documentsService.findAllDocumentsByAssetOrAreaOrSubProjectOrPM(
      id,
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

  @Put(':id')
  recoverAndUpdate(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RecoverAndUpdateDocumentDto,
  ) {
    return this.documentsService.recoverAndUpdate(req.user, id, dto);
  }

  @ApiConsumes('multipart/form-data')
  @Post()
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
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    files: UploadFilesDto,
    @Body()
    createDocumentDto: CreateDocumentDto,
  ) {
    const fileNames = getFileNameFromFolders(files, Folders);
    const checkFiles = disAllowedExtensions(fileNames);
    if (checkFiles.length) {
      throw new BadRequestException(
        `File type ${checkFiles[0]} is not allowed.`,
      );
    }
    return this.documentsService.create(
      req.headers.authorization,
      req.user,
      createDocumentDto,
      files,
    );
  }

  @Delete(':id')
  remove(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { deletedComment }: DeleteDocumentDto,
  ) {
    return this.documentsService.softDelete(req.user, id, deletedComment);
  }
}
