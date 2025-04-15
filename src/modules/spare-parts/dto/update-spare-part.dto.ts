import { PartialType } from '@nestjs/swagger';
import { CreateSparePartDto } from './create-spare-part.dto';

export class UpdateSparePartDto extends PartialType(CreateSparePartDto) {}
