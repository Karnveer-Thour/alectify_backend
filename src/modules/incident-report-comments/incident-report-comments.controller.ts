import
 {BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,} from '@nestjs/common';
import crypto from 'crypto';
import { IncidentReportCommentsService } from './incident-report-comments.service';
import { CreateIncidentReportCommentDto } from './dto/create-incident-report-comment.dto';
import { BypassAuth } from 'modules/users/decorators/bypass.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import {
  disAllowedExtensions,
  getFileNameFromFiles,
} from '@common/utils/utils';

@ApiBearerAuth()
@ApiTags('Incident Report Comments')
@Controller('incident-report-comments')
export class IncidentReportCommentsController {
  constructor(
    private readonly incidentReportCommentsService: IncidentReportCommentsService,
  ) {}

  
  @Post('email-webhook')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'attachments', maxCount: 100 }]),
  )
  async handleInboundParse(@Req() req: any) {
    return this.incidentReportCommentsService.handleInboundParse(req);
  }

  async handleEmailWebhook(@Req() req) {
    // const isValidRequest = this.validateSendGridRequest(req);
    // if (!isValidRequest) {
    //   console.error('Invalid SendGrid webhook request');
    //   return { status: 400, message: 'Invalid Request' };
    // }
    // const subject = emailData.subject || '';
    // const incidentIdMatch = subject.match(/#(\d+)/);
    // if (!incidentIdMatch) {
    //   console.error('Incident ID not found in subject:', subject);
    //   return { status: 400, message: 'Incident ID not found in the subject' };
    // }
    // const incidentReportId = incidentIdMatch[1];
    // const sender = emailData.from;
    // const body = emailData.text;
    // const systemUser = await this.userService.findByEmail(sender);
    // if (!systemUser) {
    //   console.warn(`Sender ${sender} not found, using system user.`);
    //   return { status: 400, message: 'System user not found' };
    // }
    // const createIncidentReportCommentDto: CreateIncidentReportCommentDto = {
    //   description: body,
    //   actions: '',
    //   systemState: '',
    //   callAt: null,
    //   nextUpdateAt: null,
    // };
    // await this.incidentReportCommentsService.addComment(
    //   systemUser,
    //   incidentReportId,
    //   createIncidentReportCommentDto,
    // );
    // console.log(`Comment added for Incident Report ID: ${incidentReportId}`);
  }
  @Get(':incidentReportId')
  async listComments(
    @Req() req,
    @Param('incidentReportId') incidentReportId: string,
    @Query() { limit = 10, page = 1, orderField = null, orderBy = null },
  ) {
    return await this.incidentReportCommentsService.listComments(
      incidentReportId,
      orderField,
      orderBy,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }


  @Post(':incidentReportId')
  @UseInterceptors(AnyFilesInterceptor())
  async addComment(
    @Req() req,
    @Param('incidentReportId') incidentReportId: string,
    @Body() createIncidentReportCommentDto: CreateIncidentReportCommentDto,
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

    return await this.incidentReportCommentsService.addComment(
      req.user,
      req.headers.authorization,
      incidentReportId,
      createIncidentReportCommentDto,
      files,
    );
  }

  private validateSendGridRequest(req) {
    const sendGridSecret = process.env.SENDGRID_PRIVATE_KEY;
    const signature = req.headers['X-Twilio-Email-Event-Webhook-Signature'];
    const timestamp = req.headers['X-Twilio-Email-Event-Webhook-Timestamp'];

    const calculatedSignature = this.calculateSignature(
      timestamp,
      req.body,
      sendGridSecret,
    );

    return signature === calculatedSignature;
  }

  private calculateSignature(timestamp: string, body: any, secret: string) {
    const hmac = crypto.createHmac('sha256', secret);
    const data = `${timestamp}.${JSON.stringify(body)}`;
    return hmac.update(data).digest('hex');
  }
}
