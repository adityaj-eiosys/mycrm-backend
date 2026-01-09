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
import { User } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  WON = 'WON',
  LOST = 'LOST',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @ManyToOne(() => User, (user) => user.assignedLeads)
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @Column()
  assignedToId: string;

  @ManyToOne(() => User, (user) => user.createdLeads)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @OneToMany(() => Client, (client) => client.linkedLead)
  clients: Client[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
