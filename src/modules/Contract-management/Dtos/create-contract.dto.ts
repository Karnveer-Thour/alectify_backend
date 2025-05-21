import { BaseResponseDto } from '@common/dto/base-response.dto';
import { User } from 'modules/users/entities/user.entity';
import { ContractManagement } from '../entities/contract-management.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'modules/users/dto/create-user.dto';
import { ContractManagementDto } from './contract-management.dto';

export class CreateContractDto extends BaseResponseDto {
  @ApiProperty()
  user: CreateUserDto;

  @ApiProperty()
  contractManagement: ContractManagementDto;
}
