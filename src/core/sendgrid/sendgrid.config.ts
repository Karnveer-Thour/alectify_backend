import * as SendGrid from '@sendgrid/mail';

export function initSendGrid(sendgridPrivateKey: string): void {
  SendGrid.setApiKey(sendgridPrivateKey);
}
export function sendGrid(): SendGrid.MailService {
  return SendGrid;
}
