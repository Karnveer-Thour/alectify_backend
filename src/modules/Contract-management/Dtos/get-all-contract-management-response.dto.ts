import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';
import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { ContractManagement } from '../entities/contract-management.entity';

export class GetAllContractManagementResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ContractManagement[] | [];

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}
