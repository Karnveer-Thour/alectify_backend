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
import { Organization } from 'modules/organizations/entities/organization.entity';

export class CreateContractDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  organization_name?: string;

  @ApiProperty()
  @IsEnum(UserTypes)
  @IsOptional()
  user_type?: UserTypes;

  @IsOptional()
  organization?: Organization;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contract_number: string;

  @ApiProperty()
  @IsNumber()
  contract_amount: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comments: string;

  @ApiProperty()
  @IsDateString()
  start_date: Date;

  @ApiProperty()
  @IsDateString()
  end_date: Date;

  @ApiProperty()
  @IsBoolean()
  is_recurring: boolean;

  @ApiProperty()
  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  contact_user?: User;

  @ApiProperty()
  project_id: string;

  @IsObject()
  @IsArray()
  @IsOptional()
  document?: Express.Multer.File[];
}
