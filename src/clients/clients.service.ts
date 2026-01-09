import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UsersService } from '../users/users.service';
import { LeadsService } from '../leads/leads.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    private usersService: UsersService,
    private leadsService: LeadsService,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Verify assigned manager exists
    await this.usersService.findOne(createClientDto.assignedManagerId);

    // Verify linked lead exists if provided
    if (createClientDto.linkedLeadId) {
      await this.leadsService.findOne(createClientDto.linkedLeadId);
    }

    const client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientsRepository.find({
      relations: ['assignedManager', 'linkedLead'],
    });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { id },
      relations: ['assignedManager', 'linkedLead'],
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);

    if (updateClientDto.assignedManagerId) {
      await this.usersService.findOne(updateClientDto.assignedManagerId);
    }

    if (updateClientDto.linkedLeadId) {
      await this.leadsService.findOne(updateClientDto.linkedLeadId);
    }

    Object.assign(client, updateClientDto);
    return this.clientsRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientsRepository.remove(client);
  }
}
