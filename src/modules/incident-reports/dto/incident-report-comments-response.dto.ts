import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject } from 'class-validator';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { IncidentReport } from '../entities/incident-report.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { IncidentReportStatuses } from '../models/status.enum';
import { IncidentReportComment } from 'modules/incident-report-comments/entities/incident-report-comment.entity';

export class GetAllIncidentReportCommentResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: IncidentReportComment[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}

export class GetAllIncidentReportParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectId: string;
}

export class GetAllIncidentReportQueryDto {
  @ApiProperty({
    required: false,
    minimum: 1,
    title: 'Page',
    format: 'int32',
    default: 1,
  })
  @IsOptional()
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  page: number;

  @ApiProperty({
    required: false,
    minimum: 2,
    maximum: 100,
    title: 'Limit',
    format: 'int32',
    default: 10,
  })
  @IsOptional()
  @Min(2)
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  projectId: string;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  teamMembers: string | string[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  createdById: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  orderField: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  orderBy: 'ASC' | 'DESC';

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEnum(IncidentReportStatuses)
  status: IncidentReportStatuses;
}

export class GetOneIncidentReportResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: IncidentReport;
}
