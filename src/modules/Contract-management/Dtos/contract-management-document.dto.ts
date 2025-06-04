import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ContractManagement } from '../entities/contract-management.entity';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'modules/users/entities/user.entity';

export class ContractManagementDocumentDto {
  @ApiProperty()
  @IsString()
  contractManagement: ContractManagement;

  @ApiProperty()
  @IsString()
  fileName: string;

  @IsString()
  @IsOptional()
  filePath: string;

  @ApiProperty()
  @IsString()
  fileType: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsString()
  uploadedBy: User;
}
