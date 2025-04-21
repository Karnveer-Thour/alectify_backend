import { CreateIncidentReportResponseDto } from './dto/create-incident-report-response.dto';
import { CreateIncidentReportDto } from './dto/create-incident-report.dto';
import {
  GetAllIncidentReportQueryDto,
  GetAllIncidentReportResponseDto,
} from './dto/get-all-incident-report.dto';
import { UpdateIncidentReportDto } from './dto/update-incident-report.dto';
import { IncidentReportsService } from './incident-reports.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { DeleteIncidentReportDocumentDto } from './dto/delete-incident-report-document.dto';
import { StatusUpdateIncidentReportDto } from './dto/status-update-incident-report.dto';
import { BaseResponseDto } from '@common/dto/base-response.dto';
import { SendMailDto } from '@core/sendgrid/dto/sendmail.dto';
import { SendGridService } from '@core/sendgrid/sendgrid.service';
import {
  disAllowedExtensions,
  getFileNameFromFiles,
} from '@common/utils/utils';
import { BypassAuth } from 'modules/users/decorators/bypass.decorator';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('Incident Reports')
@Controller('incident-reports')
export class IncidentReportsController {
  constructor(
    private readonly incidentReportsService: IncidentReportsService,
    private readonly sendGridService: SendGridService,
  ) {}

  @ApiOkResponse({
    type: CreateIncidentReportResponseDto,
  })
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Req() req,
    @Body() createIncidentReportDto: CreateIncidentReportDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<CreateIncidentReportResponseDto> {
    if (files?.length) {
      const fileNames = getFileNameFromFiles(files);
      const checkFiles = disAllowedExtensions(fileNames);
      if (checkFiles.length) {
        throw new BadRequestException(
          `File type ${checkFiles[0]} is not allowed.`,
        );
      }
    }
    return this.incidentReportsService.create(
      req.user,
      req.headers.authorization,
      createIncidentReportDto,
      files,
    );
  }

  @Get()
  findAll(
    @Req() req,
    @Query()
    {
      limit = 10,
      page = 1,
      search = null,
      projectId = null,
      teamMembers = null,
      createdById = null,
      status = null,
      orderField = null,
      orderBy = null,
    }: GetAllIncidentReportQueryDto,
  ): Promise<GetAllIncidentReportResponseDto> {
    return this.incidentReportsService.findAll(
      req.user,
      projectId,
      teamMembers,
      createdById,
      search,
      status,
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
    type: CreateIncidentReportResponseDto,
  })
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CreateIncidentReportResponseDto> {
    return this.incidentReportsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateIncidentReportDto: UpdateIncidentReportDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (files?.length) {
      const fileNames = getFileNameFromFiles(files);
      const checkFiles = disAllowedExtensions(fileNames);
      if (checkFiles.length) {
        throw new BadRequestException(
          `File type ${checkFiles[0]} is not allowed.`,
        );
      }
    }
    return this.incidentReportsService.update(
      req.user,
      req.headers.authorization,
      id,
      updateIncidentReportDto,
      files,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incidentReportsService.softDeleteIncidentReport(id);
  }

  @Delete('documents/:id')
  softDeleteDocument(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { deletedComment }: DeleteIncidentReportDocumentDto,
  ) {
    return this.incidentReportsService.softDeleteDocument(
      req.user,
      id,
      deletedComment,
    );
  }


  //Newly added
  @Post('downloadIncidentreport/:incidentReportId')
  async sendIncidentReportEmail(
    @Req() req,
    @Param('incidentReportId',ParseUUIDPipe) incidentReportId: string,
    @Res() res: Response,
  ){
    const pdfBuffer:any= await this.incidentReportsService.downloadReportpdf(req.user,incidentReportId);
    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="report.pdf"',
        'Content-Length': pdfBuffer.length,
      });
      res.send(pdfBuffer);
      return res;
  }
  

  @ApiOkResponse({
    type: CreateIncidentReportResponseDto,
  })
  @Patch(':id/status')
  updateIncidentReportStatus(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusUpdateDto: StatusUpdateIncidentReportDto,
  ): Promise<CreateIncidentReportResponseDto> {
    return this.incidentReportsService.updateStatus(id, statusUpdateDto);
  }

  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @Post('send-email')
  async sendEmail(
    @Req() req,
    @Body() sendEmail: SendMailDto,
  ): Promise<BaseResponseDto> {
    await this.sendGridService.sendMail(sendEmail, true);
    return {
      message: 'Incident Report Send Successfully',
    };
  }
}
