import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Lead } from '../../leads/entities/lead.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyName: string;

  @Column()
  contactPerson: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @ManyToOne(() => Lead, (lead) => lead.clients, { nullable: true })
  @JoinColumn({ name: 'linkedLeadId' })
  linkedLead: Lead;

  @Column({ nullable: true })
  linkedLeadId: string;

  @ManyToOne(() => User, (user) => user.managedClients)
  @JoinColumn({ name: 'assignedManagerId' })
  assignedManager: User;

  @Column()
  assignedManagerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
