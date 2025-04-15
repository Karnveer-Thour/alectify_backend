import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { SubProject } from '../../projects/entities/sub-project.entity';
import { Asset } from '../../assets/entities/asset.entity';
import { PreventiveMaintenances } from '../../preventive-maintenances/entities/preventive-maintenances.entity';
import { MasterPreventiveMaintenances } from '../../preventive-maintenances/entities/master-preventive-maintenances.entity';
@Entity('package_rooms')
// @Index('package_rooms_pkey', ['id'], { unique: true })
@Index('package_roo_name_a23e25_idx', ['name', 'subProject'], {})
@Index('package_rooms_project_id_7a35e329', ['subProject'], {})
export class Area {
  @Column({ primary: true, name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true, length: 255 })
  description: string;

  @Column({
    name: 'serial_number',
    type: 'numeric',
    nullable: true,
    precision: 15,
    scale: 2,
  })
  serialNumber: number | null;

  @Column({ name: 'location', type: 'varchar', length: 255 })
  location: string;

  @Column({ name: 'is_active', type: 'int', nullable: true })
  isActive: number;

  @ManyToOne(() => SubProject, (subProject) => subProject.areas)
  @JoinColumn([{ name: 'project_id', referencedColumnName: 'id' }])
  subProject: SubProject;

  @OneToMany(() => Asset, (asset) => asset.area)
  assets: Asset[];

  @OneToMany(() => PreventiveMaintenances, (pm) => pm.area)
  preventiveMaintenances: PreventiveMaintenances[];

  @OneToMany(() => MasterPreventiveMaintenances, (mpm) => mpm.area)
  masterPreventiveMaintenances: MasterPreventiveMaintenances[];

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  constructor(entity: Partial<Area>) {
    Object.assign(this, entity);
  }
}
