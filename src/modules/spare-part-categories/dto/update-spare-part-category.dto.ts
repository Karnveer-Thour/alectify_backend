import { PartialType } from '@nestjs/swagger';
import { CreateSparePartCategoryDto } from './create-spare-part-category.dto';

export class UpdateSparePartCategoryDto extends PartialType(
  CreateSparePartCategoryDto,
) {}
