import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { GetAllTimelinesResponseDto } from './dto/get-all-timelines-response.dto';
import { TimelinesView } from './entities/timelines-view.entity';
import { TimelinesViewRepository } from './repositories/timelines-view.repository';
import { Brackets } from 'typeorm';

@Injectable()
export class TimelinesService {
  constructor(private timelinesViewRepository: TimelinesViewRepository) {}

  async findDrawHistoriesByAssetOrArea(
    id: string,
    startDate: Date,
    endDate: Date,
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    options: IPaginationOptions,
  ): Promise<GetAllTimelinesResponseDto> {
    try {
      const timelines = this.timelinesViewRepository
        .createQueryBuilder('timeline')
        .where(
          new Brackets((qb) => {
            qb.where('timeline.assetId =:id', {
              id,
            }).orWhere('timeline.areaId =:id', {
              id,
            });
          }),
        );
      if (startDate && endDate) {
        timelines
          .andWhere('timeline.dueDate >=:startDate', {
            startDate: `${startDate} 00:00:00`,
          })
          .andWhere('timeline.dueDate <=:endDate', {
            endDate: `${endDate} 24:00:00`,
          });
      }
      timelines.orderBy('timeline.dueDate', 'DESC');

      const { items, meta, links } = await paginate<TimelinesView>(
        timelines,
        options,
      );
      return {
        message: 'Get all timelines successfully',
        data: items,
        links,
        meta: meta,
      };
    } catch (error) {
      throw error;
    }
  }
}
