import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { MasterPreventiveMaintenances } from '../../preventive-maintenances/entities/master-preventive-maintenances.entity';
import { Asset } from 'modules/assets/entities/asset.entity';

@Entity('master_preventive_maintenance_assets')
@Index(['masterPreventiveMaintenance', 'asset'])
export class MasterPreventiveMaintenanceAssets extends BaseEntity<MasterPreventiveMaintenanceAssets> {
  @ManyToOne(() => MasterPreventiveMaintenances, (mpm) => mpm.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'master_preventive_maintenance_id' })
  masterPreventiveMaintenance: MasterPreventiveMaintenances;

  @ManyToOne(() => Asset, (asset) => asset.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  constructor(entity: Partial<MasterPreventiveMaintenanceAssets>) {
    super(entity);
    Object.assign(this, entity);
  }
}
