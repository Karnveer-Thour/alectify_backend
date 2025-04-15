import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './branch.entity';

@Entity('companies')
// @Index('companies_pkey', ['id'], { unique: true })
export class Company {
  @Column('uuid', { primary: true, name: 'id' }) id: string;

  @Column({ name: 'name', type: 'varchar', nullable: true, length: 255 })
  name: string | null;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  description: string | null;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => Branch, (branch) => branch.company)
  branch: Branch[];
}
