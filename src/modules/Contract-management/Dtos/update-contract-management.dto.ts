import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateContractManagementDto extends BaseResponseDto {
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
  contractAmount?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comments?: string;
}
