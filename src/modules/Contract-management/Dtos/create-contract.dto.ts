import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserTypes } from 'modules/users/models/user-types.enum';
import { ContractManagementDocument } from '../entities/contract-management-document.entity';
import { User } from 'modules/users/entities/user.entity';
import { Project } from 'modules/projects/entities/project.entity';
import { Organization } from 'modules/organizations/entities/organization.entity';

export class CreateContractDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userFirstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userLastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userEmail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userImageUrl: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  organizationName?: string;

  @ApiProperty()
  @IsEnum(UserTypes)
  @IsOptional()
  userType?: UserTypes;

  @IsOptional()
  organization?: Organization;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contractNumber: string;

  @ApiProperty()
  @IsNumber()
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
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  contactUser?: User;

  @ApiProperty()
  projectId: string;

  @IsOptional()
  project: Project;

  @IsArray()
  @IsOptional()
  documents?: ContractManagementDocument[];

  @IsObject()
  @IsArray()
  @IsOptional()
  document?: Express.Multer.File[];
}
