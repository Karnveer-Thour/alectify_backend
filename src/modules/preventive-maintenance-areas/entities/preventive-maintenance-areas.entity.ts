import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { PreventiveMaintenances } from '../../preventive-maintenances/entities/preventive-maintenances.entity';
import { Area } from '../../areas/entities/area.entity';

@Entity('preventive_maintenance_areas')
@Index(['preventiveMaintenance', 'area'])
export class PreventiveMaintenanceAreas extends BaseEntity<PreventiveMaintenanceAreas> {
  @ManyToOne(() => PreventiveMaintenances, (pm) => pm.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'preventive_maintenance_id' })
  preventiveMaintenance: PreventiveMaintenances;

  @ManyToOne(() => Area, (area) => area.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  constructor(entity: Partial<PreventiveMaintenanceAreas>) {
    super(entity);
    Object.assign(this, entity);
  }
}
