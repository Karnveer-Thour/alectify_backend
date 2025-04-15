import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { MasterPreventiveMaintenances } from '../../preventive-maintenances/entities/master-preventive-maintenances.entity';
import { Area } from '../../areas/entities/area.entity';

@Entity('master_preventive_maintenance_areas')
@Index(['masterPreventiveMaintenance', 'area'])
export class MasterPreventiveMaintenanceAreas extends BaseEntity<MasterPreventiveMaintenanceAreas> {
  @ManyToOne(() => MasterPreventiveMaintenances, (mpm) => mpm.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'master_preventive_maintenance_id' })
  masterPreventiveMaintenance: MasterPreventiveMaintenances;

  @ManyToOne(() => Area, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  constructor(entity: Partial<MasterPreventiveMaintenanceAreas>) {
    super(entity);
    Object.assign(this, entity);
  }
}
