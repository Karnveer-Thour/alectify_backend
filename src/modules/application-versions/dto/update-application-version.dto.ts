import { PartialType } from '@nestjs/swagger';
import { CreateApplicationVersionDto } from './create-application-version.dto';

export class UpdateApplicationVersionDto extends PartialType(
  CreateApplicationVersionDto,
) {}
