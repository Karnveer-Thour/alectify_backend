import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateIncidentReportTeamMemberDto } from './dto/create-incident-report-team-member.dto';
import { UpdateIncidentReportTeamMemberDto } from './dto/update-incident-report-team-member.dto';
import { IncidentReportTeamMembersRepository } from './repositories/incident-report-team-members.repository';
import { IncidentReportTeamMembers } from './entities/incident-report-team-members.entity';
import { User } from '@sentry/node';
import { CreateIncidentReportTeamMemberResponseDto } from './dto/create-incident-report-team-member-response.dto';
import { IncidentReportsService } from 'modules/incident-reports/incident-reports.service';
import { UsersService } from '../users/users.service';
import { BaseResponseDto } from '@common/dto/base-response.dto';
import { In } from 'typeorm';

@Injectable()
export class IncidentReportTeamMembersService {
  constructor(
    private incidentReportTeamMembersRepository: IncidentReportTeamMembersRepository,
    @Inject(forwardRef(() => IncidentReportsService))
    private incidentReportsService: IncidentReportsService,
    private usersService: UsersService,
  ) {}

  async create(
    irId: string,
    createIncidentReportTeamMemberDto: CreateIncidentReportTeamMemberDto,
    requestUser: User,
  ): Promise<CreateIncidentReportTeamMemberResponseDto> {
    try {
      const isExist = await this.incidentReportsService.findOne(irId);
      if (!isExist) {
        throw new NotFoundException('Preventive maintenance does not exist');
      }

      const user = await this.usersService.findOneById(
        createIncidentReportTeamMemberDto.userId,
      );

      const isExistTeamMember = await this.incidentReportTeamMembersRepository
        .createQueryBuilder('tm')
        .where('tm.user = :userId', { userId: user.id })
        .andWhere('tm.incidentReport = :irId', { irId })
        .getOne();

      if (isExistTeamMember) {
        throw new BadRequestException('Team member already exist');
      }

      const teamMember = await this.incidentReportTeamMembersRepository.save(
        new IncidentReportTeamMembers({
          incidentReport: isExist.data,
          user: user,
        }),
      );

      return {
        message: 'Team member added to incident Report',
        data: { teamMember },
      };
    } catch (error) {
      throw error;
    }
  }

  async insertMany(irTeamMembers: Partial<IncidentReportTeamMembers>[]) {
    try {
      return await this.incidentReportTeamMembersRepository.insert(
        irTeamMembers,
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteByIncidentIds(incidentId: string[]): Promise<BaseResponseDto> {
    try {
      await this.incidentReportTeamMembersRepository.delete({
        incidentReport: In(incidentId),
      });
      return {
        message: 'Team members delete to Incident Report',
      };
    } catch (error) {
      throw error;
    }
  }
}
