import { PartialType } from '@nestjs/swagger';
import { CreatePreventiveMaintenanceDocumentDto } from './create-preventive-maintenance-document.dto';

export class UpdatePreventiveMaintenanceDocumentDto extends PartialType(
  CreatePreventiveMaintenanceDocumentDto,
) {}
