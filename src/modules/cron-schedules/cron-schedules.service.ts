import DefaultEmailTemplate from '@common/email-templates/default-email-template';
import { SendGridService } from '@core/sendgrid/sendgrid.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from 'modules/users/users.service';
import * as moment from 'moment';

@Injectable()
export class CronSchedulesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sendGridService: SendGridService,
  ) {}
  private readonly logger = new Logger(CronSchedulesService.name);

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleUserExpireReminderCron() {
    try {
      await this.userExpireReminder(
        moment().add(7, 'days').format('YYYY-MM-DD'),
      );
      await this.userExpireReminder(
        moment().add(2, 'days').format('YYYY-MM-DD'),
      );
      await this.userExpireReminder(moment().format('YYYY-MM-DD'));
    } catch (error) {
      this.logger.error('Called handleUserExpireReminder Cron', error);
    }
  }

  async userExpireReminder(date) {
    try {
      const contacts = await this.usersService.getContactsByDate(date);
      const users = [];
      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const userIndex = users.findIndex(
          (user) => user.email === contact.user.email,
        );
        if (userIndex >= 0) {
          users[userIndex] = {
            ...users[userIndex],
            contacts: [...users[userIndex].contacts, contact.contact],
          };
        } else {
          users.push({ ...contact.user, contacts: [contact.contact] });
        }
      }
      for (let j = 0; j < users.length; j++) {
        const user = users[j];
        let email = `<p style='margin: 0;'><b>Hello ${user.first_name} ${
          user.last_name
        }</b>,</p>
        <p>The following User(s) Access is going to be expired on ”<b>${moment(
          date,
        ).format('DD MMM, YYYY')}</b>” :-</p>
          <ul>`;
        console.log('user.contacts', user.contacts);
        for (let k = 0; k < user.contacts.length; k++) {
          const contact = user.contacts[k];
          email += `<li>${contact.first_name} ${contact.last_name}, ${contact.email}</li>`;
        }
        email += `</ul>`;
        const template = DefaultEmailTemplate.get(email);
        await this.sendGridService.sendMail({
          text: template,
          subject: `Access for following User(s) is Expiring on ${moment(
            date,
          ).format('DD MMM, YYYY')}`,
          to: user.email,
        });
      }
    } catch (error) {
      this.logger.error('Called userExpireReminder Cron', error);
    }
  }
}
