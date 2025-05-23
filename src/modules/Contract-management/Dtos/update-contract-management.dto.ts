import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateContractManagementDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contractNumber?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  contractAmount?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comments?: string;
}
