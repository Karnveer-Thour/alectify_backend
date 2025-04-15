import DefaultEmailTemplate from '@common/email-templates/default-email-template';
import { SendGridService } from '@core/sendgrid/sendgrid.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AreasService } from 'modules/areas/areas.service';
import { AssetsService } from 'modules/assets/assets.service';
import { PMTypes } from 'modules/preventive-maintenances/models/pm-types.enum';
import { Statuses } from 'modules/preventive-maintenances/models/status.enum';
import { UserTypes } from 'modules/users/models/user-types.enum';
import * as moment from 'moment';
import { PreventiveMaintenancesService } from '../preventive-maintenances/preventive-maintenances.service';
import { InjectConfig } from '@common/decorators/inject-config.decorator';
import {
  FrontendConfig,
  FrontendConfigType,
} from '@core/frontend-configs/frontend-configs.config';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export class RemindersCronService {
  constructor(
    @InjectConfig(FrontendConfig)
    private readonly frontendConfigFactory: FrontendConfigType,
    private readonly preventiveMaintenancesService: PreventiveMaintenancesService,
    private readonly sendGridService: SendGridService,
  ) {}
  private readonly logger = new Logger(RemindersCronService.name);

  // @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleReminderCron() {
    try {
      this.logger.debug('Called Reminder Cron');
      let users = [];
      const [pmsInternalUC, pmsExternalUC, serviceUC] = await Promise.all([
        this.preventiveMaintenancesService.findPMsByDueDateAndStatus(
          PMTypes.PM_INTERNAL,
          moment().format('YYYY-MM-DD'),
          moment().add(7, 'days').format('YYYY-MM-DD'),
          [Statuses.PENDING],
        ),
        this.preventiveMaintenancesService.findPMsByDueDateAndStatus(
          PMTypes.PM_EXTERNAL,
          moment().format('YYYY-MM-DD'),
          moment().add(7, 'days').format('YYYY-MM-DD'),
          [Statuses.PENDING, Statuses.IN_PROGRESS, Statuses.WAITING_FOR_REVIEW],
        ),
        this.preventiveMaintenancesService.findPMsByDueDateAndStatus(
          PMTypes.TASK,
          moment().format('YYYY-MM-DD'),
          moment().add(7, 'days').format('YYYY-MM-DD'),
          [Statuses.PENDING, Statuses.IN_PROGRESS, Statuses.WAITING_FOR_REVIEW],
        ),
      ]);
      const [pmsInternalMissed, pmsExternalMissed, serviceMissed] =
        await Promise.all([
          this.preventiveMaintenancesService.findPMsMissedDueDate(
            [PMTypes.PM_INTERNAL],
            moment().subtract(1, 'days').format('YYYY-MM-DD'),
            [Statuses.PENDING],
          ),
          this.preventiveMaintenancesService.findPMsMissedDueDate(
            [PMTypes.PM_EXTERNAL],
            moment().subtract(1, 'days').format('YYYY-MM-DD'),
            [
              Statuses.PENDING,
              Statuses.IN_PROGRESS,
              Statuses.WAITING_FOR_REVIEW,
            ],
          ),
          this.preventiveMaintenancesService.findPMsMissedDueDate(
            [PMTypes.TASK],
            moment().subtract(1, 'days').format('YYYY-MM-DD'),
            [
              Statuses.PENDING,
              Statuses.IN_PROGRESS,
              Statuses.WAITING_FOR_REVIEW,
            ],
          ),
        ]);
      const pmIntUC = await this.formatMissedAndUpComingData(
        pmsInternalUC.data,
        users,
        'pmIntUC',
      );
      const pmExtUC = await this.formatMissedAndUpComingData(
        pmsExternalUC.data,
        pmIntUC,
        'pmExtUC',
      );
      const taskUC = await this.formatMissedAndUpComingData(
        serviceUC.data,
        pmExtUC,
        'taskUC',
      );
      const pmIntMissed = await this.formatMissedAndUpComingData(
        pmsInternalMissed.data,
        taskUC,
        'pmIntMissed',
      );
      const pmExtMissed = await this.formatMissedAndUpComingData(
        pmsExternalMissed.data,
        pmIntMissed,
        'pmExtMissed',
      );
      const taskMissed = await this.formatMissedAndUpComingData(
        serviceMissed.data,
        pmExtMissed,
        'taskMissed',
      );
      users = taskMissed;
      await this.sendUpComingTasksEmails(users);
      await this.sendMissedTasksEmails(users);
    } catch (error) {
      this.logger.error('Called Reminder Cron', error);
    }
  }

  async formatMissedAndUpComingData(data, users, variableName) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      const teamMembers = (
        element.teamMembers.length
          ? element.teamMembers
          : element.team?.projectTeamMembers
      ).map((tm) => tm.user);
      for (let j = 0; j < teamMembers.length; j++) {
        const teamMember = teamMembers[j];
        const userIndex = users.findIndex(
          ({ email }) =>
            email ===
            (teamMember['email']
              ? teamMember['email']
              : teamMember['user']['email']),
        );
        if (userIndex >= 0) {
          users[userIndex][variableName] = [
            ...(users[userIndex][variableName] ?? []),
            element,
          ];
        } else {
          if ('user' in teamMember) {
            users.push({
              ...teamMember.user,
              [variableName]: [element],
            });
          } else {
            users.push({
              ...teamMember,
              [variableName]: [element],
            });
          }
        }
      }
    }
    return users;
  }

  async sendUpComingTasksEmails(users) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      let link = `${this.frontendConfigFactory.frontendUrl}/all-work-orders?redirected=email`;
      if (user.user_type === UserTypes.EXTERNAL) {
        link = `${this.frontendConfigFactory.frontendUrl}/my-work-orders?redirected=email`;
      }
      if (
        user?.taskUC?.length > 0 ||
        // user?.pmIntUC?.length > 0 ||
        user?.pmExtUC?.length > 0
      ) {
        let email = `<p style='margin: 0;'><b>Dear ${user.first_name} ${user.last_name}</b></p>
            <p style='margin: 0;'>Here is a quick summary of all work orders that have due dates scheduled within the next 7 days.</p>`;
        if (user?.taskUC?.length > 0) {
          email += `<p style='margin: 0;'><b><a href='${link}'>Tasks (${user.taskUC.length})</a></b></p>`;
          const taskUCLength = user.taskUC.length > 5 ? 5 : user.taskUC.length;
          email += `<ul>`;
          for (let j = 0; j < taskUCLength; j++) {
            const task = user.taskUC[j];
            email += `<li> <p style='margin: 0;'> <b>${
              task.project.name
            }</b></p>
                <ul><li><p style='margin: 0;'> <b>Work Title</b>: <a href='${
                  this.frontendConfigFactory.frontendUrl
                }/my-work-orders/pm/${task.project.id}/${task.subProject.id}/${
              task.id
            }?pmType=${task.pmType}&redirected=email'>"${task.workTitle}"</a>, 
                <b>${
                  task.isGeneric
                    ? 'Generic'
                    : task.area
                    ? 'Asset Package:'
                    : 'Asset:'
                }</b>`;
            if (task.area || task.asset) {
              email += ` ${task.area ? task.area.name : task.asset.name}`;
            }
            email += `</p></li><li><p style='margin: 0;'>
                <b>Created By:</b> ${task.createdBy.first_name} ${
              task.createdBy.last_name
            }, <b>Assigned To:</b> ${DefaultEmailTemplate.makeUsersDataWithoutEmail(
              task.assignees,
            )}`;
            email += `<li><p style='margin: 0;'> <b>Due Date</b>: ${moment(
              task.dueDate,
            ).format('MMM DD, YYYY')}.
                </p></li> </ul></li>`;
          }
          if (user.taskUC.length > 5) {
            email += `<p style='margin: 0;'><a href='${link}'>See More</a></p>`;
          }
          email += `</ul>`;
        }
        if (user?.pmExtUC?.length > 0) {
          email += `<p style='margin: 0;'> <b><a href='${link}'>Maintenance (${user.pmExtUC.length})</a></b></p>`;
          const pmExtUCLength =
            user.pmExtUC.length > 5 ? 5 : user.pmExtUC.length;
          email += `<ul>`;
          for (let l = 0; l < pmExtUCLength; l++) {
            const pmExt = user.pmExtUC[l];
            email += `<li> <p style='margin: 0;'> <b>${
              pmExt.project.name
            }</b></p> <ul><li><p style='margin: 0;'> <b>Work Title:</b> <a href='${
              this.frontendConfigFactory.frontendUrl
            }/my-work-orders/pm/${pmExt.project.id}/${pmExt.subProject.id}/${
              pmExt.id
            }?pmType=${pmExt.pmType}&redirected=email'>"${
              pmExt.workTitle
            }"</a>, <b>${
              pmExt.isGeneric
                ? 'Generic'
                : pmExt.area
                ? 'Asset Package:'
                : 'Asset:'
            }</b>`;
            if (pmExt.area || pmExt.asset) {
              email += ` ${pmExt.area ? pmExt.area.name : pmExt.asset.name}`;
            }
            email += `</p></li><li><p style='margin: 0;'>
                <b>Created By:</b> ${pmExt.createdBy.first_name} ${
              pmExt.createdBy.last_name
            }, <b>Assigned To</b>: ${DefaultEmailTemplate.makeUsersDataWithoutEmail(
              pmExt.assignees,
            )}`;
            email += `<li><p style='margin: 0;'> <b>Due Date:</b> ${moment(
              pmExt.dueDate,
            ).format('MMM DD, YYYY')}.
                </p></li> </ul></li>`;
          }
          if (user.pmExtUC.length > 5) {
            email += `<p style='margin: 0;'><a href='${link}'>See More</a></p>`;
          }
          email += `</ul>`;
        }
        const template = DefaultEmailTemplate.get(email);
        await this.sendGridService.sendMail({
          text: template,
          subject: `Upcoming Due Dates for the next 7 days (As of ${moment().format(
            'MMM DD, YYYY',
          )})`,
          to: user.email,
        });
      }
    }
  }

  async sendMissedTasksEmails(users) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      let link = `${this.frontendConfigFactory.frontendUrl}/all-work-orders?redirected=email`;
      if (user.user_type === UserTypes.EXTERNAL) {
        link = `${this.frontendConfigFactory.frontendUrl}/my-work-orders?redirected=email`;
      }
      if (
        user?.taskMissed?.length > 0 ||
        // user?.pmIntMissed?.length > 0 ||
        user?.pmExtMissed?.length > 0
      ) {
        let email = `<p style='margin: 0;'><b>Dear ${user.first_name} ${user.last_name}</b></p>
        <p style='margin: 0;'>Here is a quick summary of all overdue work orders.</p>`;
        if (user?.taskMissed?.length > 0) {
          email += `<p style='margin: 0;'> <b><a href='${link}'>Tasks (${user.taskMissed.length})</a></b></p>`;
          const taskMissedLength =
            user.taskMissed.length > 5 ? 5 : user.taskMissed.length;
          email += `<ul>`;
          for (let j = 0; j < taskMissedLength; j++) {
            const task = user.taskMissed[j];
            email += `<li> <p style='margin: 0;'> ${
              task.project.name
            }</p> <ul><li><p style='margin: 0;'> <b>Work Title:</b> <a href='${
              this.frontendConfigFactory.frontendUrl
            }/my-work-orders/pm/${task.project.id}/${task.subProject.id}/${
              task.id
            }?pmType=${task.pmType}&redirected=email'>"${
              task.workTitle
            }"</a>, <b>${
              task.isGeneric
                ? 'Generic'
                : task.area
                ? 'Asset Package:'
                : 'Asset:'
            }</b>`;
            if (task.area || task.asset) {
              email += ` ${task.area ? task.area.name : task.asset.name}`;
            }
            email += `</p></li><li><p style='margin: 0;'>
            <b>Created By:</b> ${task.createdBy.first_name} ${
              task.createdBy.last_name
            }, <b>Assigned To:</b> ${DefaultEmailTemplate.makeUsersDataWithoutEmail(
              task.assignees,
            )}
            </p></li>`;
            email += `<li><p style='margin: 0;'>
            <b>Due Date:</b> ${moment(task.dueDate).format('MMM DD, YYYY')}.
            </p></li> </ul></li>`;
          }
          if (user.taskMissed.length > 5) {
            email += `<p style='margin: 0;'><a href='${link}'>See More</a></p>`;
          }
          email += `</ul>`;
        }
        // if (
        //   user?.pmIntMissed?.length > 0 &&
        //   user.user_type !== UserTypes.EXTERNAL
        // ) {
        //   email += `<p style='margin: 0;'><b><u> MISSED DEADLINES (PM INTERNAL: ${user.pmIntMissed.length}) </b></u></p>`;
        //   const pmIntMissedLength =
        //     user.pmIntMissed.length > 5 ? 5 : user.pmIntMissed.length;
        //   email += `<ul>`;
        //   for (let k = 0; k < pmIntMissedLength; k++) {
        //     const pmInt = user.pmIntMissed[k];
        //     email += `<li> <p style='margin: 0;'>Site: ${
        //       pmInt.project.name
        //     }, Asset Category: ${
        //       pmInt.subProject.name
        //     }</p> <ul><li><p style='margin: 0;'> WorkId: ${
        //       pmInt.workId
        //     }, Work Title: ${pmInt.workTitle}}</p></li>
        //     <li><p style='margin: 0;'>PM Tracking: ${
        //       pmInt.isGeneric
        //         ? 'Generic'
        //         : pmInt.area
        //         ? 'Asset Package'
        //         : 'Asset'
        //     },`;
        //     if (pmInt.area || pmInt.asset) {
        //       email += `${pmInt.area ? 'Asset Package' : 'Asset'} Name: ${
        //         pmInt.area ? pmInt.area.name : pmInt.asset.name
        //       }</p> </li>`;
        //     }
        //     email += `<li><p style='margin: 0;'>Due Date: ${moment(
        //       pmInt.dueDate,
        //     ).format('MMM DD, YYYY')}.
        //     </p></li> </ul></li>`;
        //   }
        //   if (user.pmIntMissed.length > 5) {
        //     email += `<p style='margin: 0;'><a href='${this.frontendConfigFactory.frontendUrl}/my-work-orders/'>See More</a></p>`;
        //   }
        //   email += `</ul>`;
        // }

        if (user?.pmExtMissed?.length > 0) {
          email += `<p style='margin: 0;'> <b><a href='${link}'>Maintenance (${user.pmExtMissed.length})</a></b></p>`;
          const pmExtMissedLength =
            user.pmExtMissed.length > 5 ? 5 : user.pmExtMissed.length;
          email += `<ul>`;
          for (let l = 0; l < pmExtMissedLength; l++) {
            const pmExt = user.pmExtMissed[l];
            email += `<li> <p style='margin: 0;'> <b>${
              pmExt.project.name
            }</b></p> <ul><li><p style='margin: 0;'> <b>Work Title:</b> <a href='${
              this.frontendConfigFactory.frontendUrl
            }/my-work-orders/pm/${pmExt.project.id}/${pmExt.subProject.id}/${
              pmExt.id
            }?pmType=${pmExt.pmType}&redirected=email'>"${
              pmExt.workTitle
            }"</a>, <b>${
              pmExt.isGeneric
                ? 'Generic'
                : pmExt.area
                ? 'Asset Package:'
                : 'Asset:'
            }</b>`;
            if (pmExt.area || pmExt.asset) {
              email += ` ${pmExt.area ? pmExt.area.name : pmExt.asset.name}`;
            }
            email += `</p></li><li><p style='margin: 0;'>
            <b>Created By:</b> ${pmExt.createdBy.first_name} ${
              pmExt.createdBy.last_name
            }, <b>Assigned To:</b> ${DefaultEmailTemplate.makeUsersDataWithoutEmail(
              pmExt.assignees,
            )}
            </p></li>`;
            email += `<li><p style='margin: 0;'>
            <b>Due Date:</b> ${moment(pmExt.dueDate).format('MMM DD, YYYY')}.
            </p></li> </ul></li>`;
          }
          if (user.pmExtMissed.length > 5) {
            email += `<p style='margin: 0;'><a href='${link}'>See More</a></p>`;
          }
          email += `</ul>`;
        }
        const template = DefaultEmailTemplate.get(email);
        await this.sendGridService.sendMail({
          text: template,
          subject: `Overdue Work Orders (As of ${moment().format(
            'MMM DD, YYYY',
          )})`,
          to: user.email,
        });
      }
    }
  }
}
