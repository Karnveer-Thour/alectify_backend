import { InjectConfig } from '@common/decorators/inject-config.decorator';
import DefaultEmailTemplate from '@common/email-templates/default-email-template';
import {
  FrontendConfig,
  FrontendConfigType,
} from '@core/frontend-configs/frontend-configs.config';
import { SendGridService } from '@core/sendgrid/sendgrid.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from 'modules/notifications/notifications.service';
import * as moment from 'moment';

@Injectable()
export class DailyEmailCronService {
  constructor(
    @InjectConfig(FrontendConfig)
    private readonly frontendConfigFactory: FrontendConfigType,
    private readonly notificationsService: NotificationsService,
    private readonly sendGridService: SendGridService,
  ) {}
  private readonly logger = new Logger(DailyEmailCronService.name);

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleDailyEmailOfNotifications() {
    try {
      const getNotifications =
        await this.notificationsService.getNotificationsByDate(
          moment().subtract(1, 'day').format('YYYY-MM-DD'),
          moment().subtract(1, 'day').format('YYYY-MM-DD'),
        );
      const users = await this.formatDailyData(getNotifications.data);
      await this.sendEmail(users);
    } catch (error) {
      this.logger.error('Called handleDailyEmailOfPM Cron', error);
    }
  }

  async formatDailyData(data) {
    const users = [];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      const userIndex = users.findIndex(
        ({ email }) => email === element.user.email,
      );

      if (userIndex >= 0) {
        users[userIndex]['notifications'] = [
          ...(users[userIndex]['notifications'] ?? []),
          element.notification,
        ];
      } else {
        users.push({
          ...element.user,
          ['notifications']: [element.notification],
        });
      }
    }
    return users;
  }

  async sendEmail(users) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user?.notifications?.length > 0) {
        let email = `<p style='margin: 0;'><b>Dear ${user.first_name} ${user.last_name}</b></p>
          <p style='margin: 0;'>Here a complete <a href='${this.frontendConfigFactory.frontendUrl}/notifications?redirected=email'>list of notifications</a> ${user.notifications.length} for the previous day.</p>`;
        if (user.notifications?.length > 0) {
          email += `<ul>`;
          for (let k = 0; k < user.notifications.length; k++) {
            const notification = user.notifications[k];
            email += `<li><p style='margin: 0;'><b>${moment(
              notification.createdAt,
            ).format('HH:mm:ss')} - ${notification.createdBy.first_name} ${
              notification.createdBy.last_name
            }</b> ${notification.message}</p></li>`;
            email += `<ul><li><p style='margin: 0;'><b>Site:</b> ${
              notification.preventiveMaintenance.project.name
            }, <b>Work Title:</b> <a href='${
              this.frontendConfigFactory.frontendUrl
            }/my-work-orders/pm/${
              notification.preventiveMaintenance.project.id
            }/${notification.preventiveMaintenance.subProject.id}/${
              notification.preventiveMaintenance.id
            }?pmType=${
              notification.preventiveMaintenance.pmType
            }&redirected=email'>"${
              notification.preventiveMaintenance.workTitle
            }"</a>, <b>${
              notification.preventiveMaintenance.isGeneric
                ? 'Generic'
                : notification.preventiveMaintenance.area
                ? 'Asset Package:'
                : 'Asset:'
            }</b> `;
            if (
              notification.preventiveMaintenance.area ||
              notification.preventiveMaintenance.asset
            ) {
              email += ` ${
                notification.preventiveMaintenance.area
                  ? notification.preventiveMaintenance.area.name
                  : notification.preventiveMaintenance.asset.name
              }`;
            }
            email += `</p></li></ul>`;
          }
        }
        email += `</ul>`;
        const template = DefaultEmailTemplate.get(email);
        await this.sendGridService.sendMail({
          text: template,
          subject: `List of Notifications for ${moment()
            .subtract(1, 'day')
            .format('MMM DD, YYYY')}`,
          to: user.email,
        });
      }
    }
  }
}
