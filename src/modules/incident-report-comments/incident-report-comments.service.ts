import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { simpleParser } from 'mailparser';
import { IncidentReportComment } from './entities/incident-report-comment.entity';
import { IncidentReportsRepository } from 'modules/incident-reports/repositories/incident-repository';
import { IncidentReportCommentsRepository } from './repositories/incident-report-comments.repository';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CreateIncidentReportCommentDto } from './dto/create-incident-report-comment.dto';
import { In, Not } from 'typeorm';
import { GetAllIncidentReportCommentResponseDto } from 'modules/incident-reports/dto/incident-report-comments-response.dto';
import { UsersService } from 'modules/users/users.service';
import {
  dateToUTC,
  displayDateWithTimeZoneWithOutSecond,
  getTimeZone,
  getTimeZoneShortForm,
} from '@common/utils/utils';
import { FilesUploadService } from 'modules/files-upload/files-upload.service';
import { IncidentReportCommentFilesRepository } from './repositories/incident-report-comment-files.repository';
import { SendMailDto } from '@core/sendgrid/dto/sendmail.dto';
import { SendGridService } from '@core/sendgrid/sendgrid.service';

@Injectable()
export class IncidentReportCommentsService {
  constructor(
    private usersService: UsersService,
    private readonly incidentReportCommentsRepository: IncidentReportCommentsRepository,
    private readonly incidentReportCommentFilesRepository: IncidentReportCommentFilesRepository,
    private fileUploadService: FilesUploadService,

    @Inject(forwardRef(() => IncidentReportsRepository))
    private readonly incidentReportRepository: IncidentReportsRepository,
    private userService: UsersService,
    private readonly sendGridService: SendGridService,
  ) {}

  async listComments(
    incidentReportId: string,
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    options: IPaginationOptions,
  ): Promise<GetAllIncidentReportCommentResponseDto> {
    try {
      const limit = parseInt(options.limit as string);
      const page = parseInt(options.page as string);

      const incidentReport = await this.incidentReportRepository.findOne({
        where: { id: incidentReportId },
      });

      if (!incidentReport) {
        throw new Error('Incident report not found');
      }

      const [data, count] =
        await this.incidentReportCommentsRepository.findAndCount({
          where: { incidentReport: { id: incidentReportId } },
          relations: ['createdBy', 'files'],
          order: { [orderField || 'createdAt']: orderBy || 'DESC' }, // Inline defaults
          take: limit,
          skip: (page - 1) * limit,
        });

      return {
        data: data,
        message: 'Get All Incident Reports Comments Successfully',
        meta: {
          currentPage: page,
          itemCount: data.length,
          itemsPerPage: limit,
          totalItems: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getComments(incidentReportId: string, notIds) {
    try {
      return this.incidentReportCommentsRepository.find({
        where: {
          id: Not(In(notIds)),
          incidentReport: { id: incidentReportId },
        },
        relations: ['createdBy'],
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async addComment(
    user,
    token,
    incidentReportId: string,
    createIncidentReportCommentDto: CreateIncidentReportCommentDto,
    files,
  ) {
    try {
      const [incidentReport, updatedUser] = await Promise.all([
        this.incidentReportRepository.findOneWithTeam(incidentReportId),
        this.usersService.findOneById(user.id),
      ]);
      if (!incidentReport) {
        throw new Error('Incident report not found');
      }
      let projectTimezone = null;
      let projectTimezoneShortForm = null;
      if (incidentReport.project.latitude && incidentReport.project.longitude) {
        projectTimezone = getTimeZone(
          incidentReport.project.latitude,
          incidentReport.project.longitude,
        );
        projectTimezoneShortForm = getTimeZoneShortForm(projectTimezone);
      }

      const incidentReportComment = new IncidentReportComment({
        ...createIncidentReportCommentDto,
        incidentReport,
        createdBy: updatedUser,
        isSystemGenerated: false,
      });

      const comment = await this.incidentReportCommentsRepository.save(
        incidentReportComment,
      );
      await this.sendCommentEmail(
        incidentReport,
        createIncidentReportCommentDto,
        files,
        comment,
        updatedUser,
        token,
        projectTimezone,
        projectTimezoneShortForm,
      );
      return {
        message: 'Incident Report Comment created successfully',
        data: comment,
      };
    } catch (error) {
      throw error;
    }
  }

  async addCommentFromWebhook(
    user,
    token,
    incidentReportId: string,
    createIncidentReportCommentDto: CreateIncidentReportCommentDto,
    files,
    unknownUserName = null,
  ) {
    const [incidentReport, updatedUser] = await Promise.all([
      this.incidentReportRepository.findOne({
        where: { id: incidentReportId },
      }),
      user ? this.usersService.findOneById(user.id) : null,
    ]);

    if (incidentReport) {
      const incidentReportComment = new IncidentReportComment({
        ...createIncidentReportCommentDto,
        callAt: createIncidentReportCommentDto.callAt
          ? dateToUTC(createIncidentReportCommentDto.callAt)
          : null,
        nextUpdateAt: createIncidentReportCommentDto.nextUpdateAt
          ? dateToUTC(createIncidentReportCommentDto.nextUpdateAt)
          : null,
        incidentReport,
        createdBy: updatedUser,
        isSystemGenerated: false,
        unknownUserName,
      });

      const comment = await this.incidentReportCommentsRepository.save(
        incidentReportComment,
      );

      if (files?.length) {
        const uploadedFiles = await this.fileUploadService.multiFileUpload(
          files,
          'incident-reports',
          true,
          token,
          updatedUser.branch.company.id,
        );

        const uploadFiles = uploadedFiles.map((uploadedFile) => ({
          incidentReportComment: comment.id as any,
          uploadedBy: user,
          fileName: uploadedFile.originalname,
          filePath: uploadedFile.key,
          fileType: uploadedFile.mimetype,
          updatedAt: dateToUTC(),
          createdAt: dateToUTC(),
        }));

        await this.incidentReportCommentFilesRepository.insert(uploadFiles);
      }

      return {
        message: 'Incident Report Comment created successfully',
        data: comment,
      };
    }
  }

  async handleInboundParse(req) {
    try {
      const parsedEmail = await simpleParser(req.body.email);
      // console.log('123123123123', parsedEmail, {
      //   from: parsedEmail.from?.text,
      //   to: parsedEmail.to?.text,
      //   subject: parsedEmail.subject,
      //   text: parsedEmail.text,
      //   html: parsedEmail.html,
      //   attachments: parsedEmail.attachments.map((attachment) => ({
      //     filename: attachment.filename,
      //     contentType: attachment.contentType,
      //     content: attachment.content.toString('base64'),
      //   })),
      // });
      console.log(
        'parsedEmail.from?.textparsedEmail.from?.text',
        parsedEmail,
        req.body,
      );

      const match = parsedEmail.from?.text.match(/"([^"]+)"\s*<([^>]+)>/);
      let name = null;
      let email = null;
      console.log('matchmatchmatch', match);
      if (match) {
        name = match[1];
        email = match[2];
      }

      const systemUser = await this.userService.findByEmail(email);
      // if (!systemUser) {
      //   console.warn(
      //     `Sender ${parsedEmail.from?.text} not found, using system user.`,
      //   );
      //   throw new NotFoundException('System user not found');
      // }
      // Extract the UUID
      const uuidRegexMatch = parsedEmail.subject.match(
        /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
      );
      if (uuidRegexMatch) {
        await this.addCommentFromWebhook(
          systemUser ?? null,
          null,
          uuidRegexMatch[0],
          {
            description: parsedEmail.html,
            actions: '',
            systemState: '',
            callAt: null,
            nextUpdateAt: null,
          },
          null,
          !systemUser ? name : null,
        );
      }

      return { message: 'Webhook received successfully' };
    } catch (error) {
      throw error;
    }
  }

  async sendCommentEmail(
    incidentReport,
    createIncidentReportCommentDto,
    files,
    comment,
    updatedUser,
    token,
    projectTimezone = null,
    projectTimezoneShortForm = null,
  ) {
    const comments = await this.getComments(incidentReport.id, [comment.id]);
    const impactedAssetsAndAreas =
      [
        ...(incidentReport?.assets?.map(({ asset }) => asset.name) || []),
        ...(incidentReport?.areas?.map(({ area }) => area.name) || []),
      ].join(', ') || 'None';
    let incidentReportCommentHtml = `<h3 style="color: #0954f1">Incident Summary</h3>
    <span><strong>Incident Title: </strong> ${incidentReport.title}</span><br>`;

    if (incidentReport.incidentNo || incidentReport.incidentDate) {
      incidentReportCommentHtml += `<span>`;
      if (incidentReport.incidentNo) {
        incidentReportCommentHtml += `<strong>Incident #: </strong> ${incidentReport.incidentNo} `;
      }
      if (incidentReport.incidentDate) {
        incidentReportCommentHtml += `<strong>Incident Date/Time: </strong> ${displayDateWithTimeZoneWithOutSecond(
          incidentReport.incidentDate,
          false,
          projectTimezone,
        )} ${projectTimezoneShortForm ? `(${projectTimezoneShortForm})` : ''}`;
      }
      incidentReportCommentHtml += `</span><br>`;
    }
    incidentReportCommentHtml += `<span><strong>Incident Type: </strong> ${incidentReport.type}</span><br>`;
    if (incidentReport?.impact?.name) {
      incidentReportCommentHtml += `<span><strong>Incident Impact: </strong> ${incidentReport?.impact?.name}</span><br>`;
    }
    if (incidentReport?.affectedSystem?.name) {
      incidentReportCommentHtml += `<span><strong>Affected Systems: </strong> ${incidentReport?.affectedSystem?.name}</span><br>`;
    }
    incidentReportCommentHtml += `<span><strong>Impacted Assets: </strong> ${impactedAssetsAndAreas}</span><br>`;
    if (incidentReport.priority) {
      incidentReportCommentHtml += `<span><strong>Priority: </strong> ${incidentReport.priority}</span><br>`;
    }
    incidentReportCommentHtml += `<span><strong>Created by/at: </strong> ${
      incidentReport.createdBy.first_name
    } ${
      incidentReport.createdBy.last_name
    } created at ${displayDateWithTimeZoneWithOutSecond(
      incidentReport.createdAt,
      false,
      projectTimezone,
    )} ${
      projectTimezoneShortForm ? `(${projectTimezoneShortForm})` : ''
    }</span><br>`;
    incidentReportCommentHtml += `
       <h3 style="color: #0954f1">Next Update:</h3> 
       <span>${
         createIncidentReportCommentDto.nextUpdateAt
           ? `${displayDateWithTimeZoneWithOutSecond(
               createIncidentReportCommentDto.nextUpdateAt,
               false,
               projectTimezone,
             )} ${
               projectTimezoneShortForm ? `(${projectTimezoneShortForm})` : ''
             }`
           : '-'
       }</span>
        <h3 style="color: #0954f1">System State</h3>
        <span>${createIncidentReportCommentDto?.systemState ?? '-'}</span>
        <h3 style="color: #0954f1">Actions</h3>
        <span>${createIncidentReportCommentDto?.actions ?? '-'}</span>`;

    if (comments.length) {
      incidentReportCommentHtml += `<br><h3>---------------------------------------------------------------------------------------</h3>
          <h3 style="color: #0954f1">Incident Timeline</h3>`;
      for (let index = 0; index < comments.length; index++) {
        const element = comments[index];
        incidentReportCommentHtml += `<h3 style="color: #0954f1">${
          index + 1
        }. Time Of Update : ${displayDateWithTimeZoneWithOutSecond(
          element.createdAt,
          false,
          projectTimezone,
        )} ${
          projectTimezoneShortForm ? `(${projectTimezoneShortForm})` : ''
        } </h3>
          <span><strong>by: </strong> ${element.createdBy.first_name} ${
          element.createdBy.last_name
        } </span><br>`;

        if (
          !element.isSystemGenerated &&
          element.description != '.' &&
          element.description != null
        ) {
          incidentReportCommentHtml += `<span><strong>Replied: </strong> ${
            element?.description ?? '-'
          }</span><br>`;
        } else {
          incidentReportCommentHtml += `<span><strong>Next Update: </strong> ${
            createIncidentReportCommentDto.nextUpdateAt
              ? `${displayDateWithTimeZoneWithOutSecond(
                  element.nextUpdateAt,
                  false,
                  projectTimezone,
                )} ${
                  projectTimezoneShortForm
                    ? `(${projectTimezoneShortForm})`
                    : ''
                }`
              : '-'
          } </span><br> <span><strong>System State: </strong> ${
            element?.systemState ?? '-'
          }</span><br> <span><strong>Actions: </strong> ${
            element?.actions ?? '-'
          }</span><br>`;
          if (element.description === '.' || element.description === null) {
            incidentReportCommentHtml += `<span><strong>Description: </strong> ${
              element?.description ?? '-'
            }</span><br>`;
          }
        }
      }
    }

    let emailAttachments = [];

    if (files?.length) {
      const uploadedFiles = await this.fileUploadService.multiFileUpload(
        files,
        'incident-reports',
        true,
        token,
        updatedUser.branch.company.id,
      );

      const uploadFiles = uploadedFiles.map((uploadedFile) => ({
        incidentReportComment: comment.id as any,
        uploadedBy: updatedUser,
        fileName: uploadedFile.originalname,
        filePath: uploadedFile.key,
        fileType: uploadedFile.mimetype,
        updatedAt: dateToUTC(),
        createdAt: dateToUTC(),
      }));
      emailAttachments = uploadedFiles.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
        type: file.mimetype,
        disposition: 'attachment',
      }));
      await this.incidentReportCommentFilesRepository.insert(uploadFiles);
    }

    const createdByEmail = updatedUser.email;
    const teamMemberEmails = incidentReport.teamMembers?.map(
      (member) => member.user.email,
    );

    const teamEmails = incidentReport?.team?.projectTeamMembers.map(
      ({ user }) => user.email,
    );

    const uniqueEmails = Array.from(
      new Set([
        createdByEmail,
        ...(teamMemberEmails ?? []),
        ...(teamEmails ?? []),
      ]),
    );

    const emailPayload: SendMailDto = {
      to: uniqueEmails,
      subject: `${incidentReport.title} (Ticket #: ${incidentReport.id})`,
      text: ` 
        ${incidentReportCommentHtml}
              ---------------------------------------------------------------------------------------
              <p>This is an Automated email. You can Reply to this email and it will be automatically entered into the system.</p>
            `,
      attachments: emailAttachments,
    };

    this.sendGridService.sendMailTest(emailPayload, true);
  }
}
