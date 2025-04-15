import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { Organization } from 'modules/organizations/entities/organization.entity';

export class GetSparePartPreferredSuppliersResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: Organization[];
}
