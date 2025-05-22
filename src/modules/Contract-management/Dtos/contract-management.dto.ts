import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContractManagementDocument } from '../entities/contract-management-document.entity';

export class ContractManagementDto extends BaseResponseDto {
  @ApiProperty()
  @IsString()
  project: string;

  @ApiProperty()
  @IsString()
  organization: string;

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

  @ApiProperty()
  @IsString()
  contactUser: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  documents: ContractManagementDocument[];
}
