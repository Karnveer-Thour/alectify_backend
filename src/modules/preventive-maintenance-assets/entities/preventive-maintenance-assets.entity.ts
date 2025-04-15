import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { PreventiveMaintenances } from '../../preventive-maintenances/entities/preventive-maintenances.entity';
import { Asset } from '../../assets/entities/asset.entity';

@Entity('preventive_maintenance_assets')
@Index(['preventiveMaintenance', 'asset'])
export class PreventiveMaintenanceAssets extends BaseEntity<PreventiveMaintenanceAssets> {
  @ManyToOne(() => PreventiveMaintenances, (pm) => pm.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'preventive_maintenance_id' })
  preventiveMaintenance: PreventiveMaintenances;

  @ManyToOne(() => Asset, (asset) => asset.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  constructor(entity: Partial<PreventiveMaintenanceAssets>) {
    super(entity);
    Object.assign(this, entity);
  }
}
