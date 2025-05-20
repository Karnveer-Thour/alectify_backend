import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'aws-sdk/clients/kendra';
import {
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsOptional,
  IsString,
} from 'class-validator';
import { Organization } from 'modules/organizations/entities/organization.entity';
import { User } from 'modules/users/entities/user.entity';

export class ContractManagementDto extends BaseResponseDto {
  @ApiProperty()
  @IsString()
  project: Project;

  @ApiProperty()
  @IsString()
  organization: Organization;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contractNumber: string;

  @ApiProperty()
  @IsDecimal()
  contractAmount: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comments: string;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  @IsBoolean()
  isRecurring: boolean;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  softDeletedAt: Date;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsString()
  contactUser: User;
}
