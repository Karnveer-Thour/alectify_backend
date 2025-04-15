import { Inject, Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/sendmail.dto';
import { SendConfigType, SendGridConfig } from './sendgrid-mailer.config';
import { sendGrid } from './sendgrid.config';

// TODO: For some unknkown reason if mailer service implements MailerFactoryInterface nest js initialization hangs up.
@Injectable()
export class SendGridService {
  constructor(
    @Inject(SendGridConfig.KEY)
    private readonly sendgridFactory: SendConfigType,
  ) {}

  async sendMail(payload: SendMailDto, isManualTrigger = false): Promise<void> {
    const sendGridMail = sendGrid();

    const normalizeRecipients = (recipients) =>
      Array.isArray(recipients) ? recipients : recipients ? [recipients] : [];

    const recipients = Array.isArray(payload.to) ? payload.to : [payload.to];
    const ccRecipients = normalizeRecipients(payload.cc);
    const bccRecipients = normalizeRecipients(payload.bcc);

    const toEmails = recipients.map((email) => ({ email }));
    const ccEmails = ccRecipients.map((email) => ({ email }));

    const bccEmails = bccRecipients.map((email) => ({ email }));

    const emailPayload = {
      personalizations: [
        {
          to: toEmails,
          cc: ccEmails.length ? ccEmails : undefined,
          bcc: bccEmails.length ? bccEmails : undefined,
          subject: payload.subject,
        },
      ],
      from: {
        email: this.sendgridFactory.sendgridFromEmail,
      },
      replyTo: {
        email: this.sendgridFactory.sendgridReplyEmail,
      },
      html: payload.text,
      attachments: payload.attachments
        ? payload.attachments.map((attachment) => ({
            filename: attachment.filename,
            content: attachment.content.toString('base64'),
            type: attachment.mimeType,
            disposition: 'attachment',
          }))
        : [],
    };

    if (isManualTrigger) {
      try {
        const response = await sendGridMail.send(emailPayload);
        console.log('Email sent successfully:', response);
      } catch (error) {
        console.error(
          'Error sending email:',
          error.response ? error.response.body : error,
        );
        throw new Error('Failed to send email');
      }
    }
  }

  async sendMailTest(
    payload: SendMailDto,
    isManualTrigger = false,
  ): Promise<void> {
    const sendGridMail = sendGrid();

    const normalizeRecipients = (recipients) =>
      Array.isArray(recipients) ? recipients : recipients ? [recipients] : [];

    const recipients = Array.isArray(payload.to) ? payload.to : [payload.to];
    const ccRecipients = normalizeRecipients(payload.cc);
    const bccRecipients = normalizeRecipients(payload.bcc);

    const toEmails = recipients.map((email) => ({ email }));
    const ccEmails = ccRecipients.map((email) => ({ email }));

    const bccEmails = bccRecipients.map((email) => ({ email }));

    const emailPayload = {
      personalizations: [
        {
          to: toEmails,
          cc: ccEmails.length ? ccEmails : undefined,
          bcc: bccEmails.length ? bccEmails : undefined,
          subject: payload.subject,
        },
      ],
      from: {
        email: this.sendgridFactory.testSendgridFromEmail,
      },
      replyTo: {
        email: this.sendgridFactory.testSendgridReplyEmail,
      },
      html: payload.text,
      attachments: payload.attachments
        ? payload.attachments.map((attachment) => ({
            filename: attachment.filename,
            content: attachment.content.toString('base64'),
            type: attachment.mimeType,
            disposition: 'attachment',
          }))
        : [],
    };

    if (isManualTrigger) {
      try {
        const response = await sendGridMail.send(emailPayload);
        console.log('Email sent successfully:', response);
      } catch (error) {
        console.error(
          'Error sending email:',
          error.response ? error.response.body : error,
        );
        throw new Error('Failed to send email');
      }
    }
  }
}
