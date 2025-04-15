import { ConfigType, registerAs } from '@nestjs/config';

export interface SendGridConfigInterface {
  sendgridPrivateKey: string;
  sendgridFromEmail: string;
  sendgridReplyEmail: string;
  testSendgridFromEmail: string;
  testSendgridReplyEmail: string;
}

export const SENDGRID_CONFIG = 'SENDGRID_CONFIG';

export const SendGridConfig = registerAs<SendGridConfigInterface>(
  SENDGRID_CONFIG,
  () => {
    const {
      env: {
        SENDGRID_PRIVATE_KEY,
        MAILER_FROM_EMAIL,
        MAILER_REPLY_EMAIL,
        TEST_MAILER_FROM_EMAIL,
        TEST_MAILER_REPLY_EMAIL,
      },
    } = process;

    return {
      sendgridPrivateKey: SENDGRID_PRIVATE_KEY,
      sendgridFromEmail: MAILER_FROM_EMAIL,
      sendgridReplyEmail: MAILER_REPLY_EMAIL,
      testSendgridFromEmail: TEST_MAILER_FROM_EMAIL,
      testSendgridReplyEmail: TEST_MAILER_REPLY_EMAIL,
    };
  },
);

export type SendConfigType = ConfigType<typeof SendGridConfig>;
