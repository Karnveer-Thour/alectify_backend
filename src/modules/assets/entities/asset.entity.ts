import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubProject } from '../../projects/entities/sub-project.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Area } from '../../areas/entities/area.entity';
import { PreventiveMaintenances } from '../../preventive-maintenances/entities/preventive-maintenances.entity';
import { MasterPreventiveMaintenances } from '../../preventive-maintenances/entities/master-preventive-maintenances.entity';

@Entity('tags')
// @Index('tags_pkey', ['id'], { unique: true })
@Index('tags_manufacture_id_8de00732', ['manufacture'], {})
@Index('tags_name_1a978a_idx', ['name', 'subProject'], {})
@Index('tags_packageroom_id_a54525f4', ['area'], {})
@Index('tags_preferred_supplier_id_ab44a6e6', ['preferredSupplier'], {})
@Index('tags_project_id_52563fe8', ['subProject'], {})
export class Asset {
  @Column({ primary: true, name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string;

  @Column({ name: 'tag_image_url', type: 'varchar', length: 255 })
  tagImageUrl: string;

  @Column({ name: 'reference_number', type: 'varchar', length: 255 })
  referenceNumber: string;

  @Column({ name: 'status', type: 'varchar', nullable: true, length: 20 })
  status: string | null;

  @Column({ name: 'is_active', type: 'int', nullable: true })
  isActive: number | null;

  @Column({ name: 'installation_date', type: 'date', nullable: true })
  installationDate: string | null;

  @Column({
    name: 'asset_type',
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  assetType: string | null;

  @Column({ name: 'warranty_date', type: 'date', nullable: true })
  warrantyDate: string | null;

  @Column({ name: 'group', type: 'varchar', nullable: true, length: 100 })
  group: string | null;

  @Column({
    name: 'serial_number',
    type: 'numeric',
    nullable: true,
    precision: 15,
    scale: 2,
  })
  serialNumber: number | null;

  @Column({ name: 'model_serial_number', type: 'varchar', length: 255 })
  modelSerialNumber: string;

  @Column({ name: 'location', type: 'varchar', length: 255 })
  location: string;

  @Column({ name: 'model', type: 'varchar', length: 255 })
  model: string;

  @ManyToOne(
    () => Organization,
    (organizations) => organizations.assetManufactures,
  )
  @JoinColumn([{ name: 'manufacture_id', referencedColumnName: 'id' }])
  manufacture: Organization;

  @ManyToOne(() => Area, (area) => area.assets)
  @JoinColumn([{ name: 'packageroom_id', referencedColumnName: 'id' }])
  area: Area;

  @ManyToOne(
    () => Organization,
    (organizations) => organizations.assetPreferredSuppliers,
  )
  @JoinColumn([{ name: 'preferred_supplier_id', referencedColumnName: 'id' }])
  preferredSupplier: Organization;

  @ManyToOne(() => SubProject, (subProject) => subProject.assets)
  @JoinColumn([{ name: 'project_id', referencedColumnName: 'id' }])
  subProject: SubProject;

  @OneToMany(() => PreventiveMaintenances, (pm) => pm.asset)
  preventiveMaintenances: PreventiveMaintenances[];

  @OneToMany(() => MasterPreventiveMaintenances, (mpm) => mpm.asset)
  masterPreventiveMaintenances: MasterPreventiveMaintenances[];

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  constructor(entity: Partial<Asset>) {
    Object.assign(this, entity);
  }
}
