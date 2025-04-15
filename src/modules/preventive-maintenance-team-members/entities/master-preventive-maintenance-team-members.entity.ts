import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { MasterPreventiveMaintenances } from '../../preventive-maintenances/entities/master-preventive-maintenances.entity';
import { User } from '../../users/entities/user.entity';

@Entity('master_preventive_maintenance_team_members')
@Index(['masterPreventiveMaintenance', 'user'])
export class MasterPreventiveMaintenanceTeamMembers extends BaseEntity<MasterPreventiveMaintenanceTeamMembers> {
  @ManyToOne(() => MasterPreventiveMaintenances, (mpm) => mpm.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'master_preventive_maintenance_id' })
  masterPreventiveMaintenance: MasterPreventiveMaintenances;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  constructor(entity: Partial<MasterPreventiveMaintenanceTeamMembers>) {
    super(entity);
    Object.assign(this, entity);
  }
}
