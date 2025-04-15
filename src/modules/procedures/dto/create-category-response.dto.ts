import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { ProcedureCategories } from '../entities/procedure-category-entity';

export class CreateCategoryResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ProcedureCategories;
}
