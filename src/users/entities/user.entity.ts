import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  
} from 'typeorm';
import { UsersRole } from '../../roles/entities/usersRole.entity';
import { Lead } from '../../leads/entities/lead.entity';
import { Client } from '../../clients/entities/client.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  mobileNumber: string;

  @Column()
  password: string;

  @ManyToOne(() => UsersRole, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: UsersRole;

  @Column()
  roleId: string;

  @Column({ default: true })
  enabled: boolean;

  @OneToMany(() => Lead, (lead) => lead.assignedTo)
  assignedLeads: Lead[];

  @OneToMany(() => Lead, (lead) => lead.createdBy)
  createdLeads: Lead[];

  @OneToMany(() => Client, (client) => client.assignedManager)
  managedClients: Client[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
