import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { PreventiveMaintenances } from '../../preventive-maintenances/entities/preventive-maintenances.entity';
import { User } from '../../users/entities/user.entity';

@Entity('preventive_maintenance_team_members')
@Index(['preventiveMaintenance', 'user'])
export class PreventiveMaintenanceTeamMembers extends BaseEntity<PreventiveMaintenanceTeamMembers> {
  @ManyToOne(() => PreventiveMaintenances, (pm) => pm.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'preventive_maintenance_id' })
  preventiveMaintenance: PreventiveMaintenances;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  constructor(entity: Partial<PreventiveMaintenanceTeamMembers>) {
    super(entity);
    Object.assign(this, entity);
  }
}
