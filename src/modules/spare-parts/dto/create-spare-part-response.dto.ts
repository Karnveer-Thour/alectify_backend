import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { ProjectSparePart } from '../entities/project-spare-part.entity';
import { SparePart } from '../entities/spare-part.entity';

export class CreateSparePartResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ProjectSparePart | SparePart;
}
