import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SparePartCategoriesService } from './spare-part-categories.service';

@ApiBearerAuth()
@ApiTags('Spare Part Categories')
@Controller('spare-part-categories')
export class SparePartCategoriesController {
  constructor(
    private readonly sparePartCategoriesService: SparePartCategoriesService,
  ) {}
}
