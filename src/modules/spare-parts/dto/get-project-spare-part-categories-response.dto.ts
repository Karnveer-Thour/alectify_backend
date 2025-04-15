import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { ProjectSparePartCategory } from 'modules/spare-part-categories/entities/project-spare-part-category.entity';

export class GetSparePartCategoriesResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ProjectSparePartCategory[];
}
