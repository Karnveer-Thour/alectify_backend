import { BaseResponseDto } from '@common/dto/base-response.dto';
import { User } from 'modules/users/entities/user.entity';
import { ContractManagement } from '../entities/contract-management.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'modules/users/dto/create-user.dto';
import { ContractManagementDto } from './contract-management.dto';
import { ContractManagementDocumentDto } from './contract-management-document.dto';
import { IsArray, IsObject, IsOptional } from 'class-validator';

export class CreateContractDto extends BaseResponseDto {
  @ApiProperty()
  user: CreateUserDto;

  @ApiProperty()
  contractManagement: ContractManagementDto;

  @ApiProperty()
  @IsOptional()
  contractManagementDocumentsData?: ContractManagementDocumentDto;

    @IsObject()
    @IsArray()
    @IsOptional()
    documents: Express.Multer.File[];
}
