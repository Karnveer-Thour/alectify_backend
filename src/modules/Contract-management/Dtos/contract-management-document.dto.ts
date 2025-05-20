import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ContractManagement } from '../entities/contract-management.entity';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'modules/users/entities/user.entity';

export class ContractManagementDocumentDto extends BaseResponseDto {
  @ApiProperty()
  @IsString()
  contractManagement: ContractManagement;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  filePath: string;

  @ApiProperty()
  @IsString()
  fileType: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  softDeletedAt: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  deletedBy: User;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  recoveredAt: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  recoveredBy: User;

  @ApiProperty()
  @IsString()
  uploadedBy: User;
}
