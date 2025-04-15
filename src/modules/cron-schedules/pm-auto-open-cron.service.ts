import { InjectConfig } from '@common/decorators/inject-config.decorator';
import {
  FrontendConfig,
  FrontendConfigType,
} from '@core/frontend-configs/frontend-configs.config';
import { SendGridService } from '@core/sendgrid/sendgrid.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PMTypes } from 'modules/preventive-maintenances/models/pm-types.enum';
import { Statuses } from 'modules/preventive-maintenances/models/status.enum';
import * as moment from 'moment';
import { PreventiveMaintenancesService } from '../preventive-maintenances/preventive-maintenances.service';

@Injectable()
export class PmAutoOpenCronService {
  constructor(
    @InjectConfig(FrontendConfig)
    private readonly frontendConfigFactory: FrontendConfigType,
    private readonly preventiveMaintenancesService: PreventiveMaintenancesService,
    private readonly sendGridService: SendGridService,
  ) {}
  private readonly logger = new Logger(PmAutoOpenCronService.name);

  // @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async autoOpenPMCron() {
    try {
      this.logger.debug('Called autoOpenPM Cron');
      const missedPm =
        await this.preventiveMaintenancesService.findPMsMissedForAutoCronDueDate(
          [PMTypes.PM_EXTERNAL, PMTypes.TASK],
          moment().subtract(1, 'days').format('YYYY-MM-DD'),
          [Statuses.PENDING, Statuses.IN_PROGRESS, Statuses.WAITING_FOR_REVIEW],
        );
      console.log('Processed PM:', missedPm?.data?.length);
      await Promise.all(
        missedPm?.data?.map(async (element) => {
          console.log('Processed PM:', element.id);
          await this.preventiveMaintenancesService.openNewPmAndTask(element);
        }),
      );
    } catch (error) {
      this.logger.error('Called autoOpenPM Cron', error);
    }
  }
}
