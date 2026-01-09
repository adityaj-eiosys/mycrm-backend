import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
    private usersService: UsersService,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    // Verify assigned user exists
    await this.usersService.findOne(createLeadDto.assignedToId);
    await this.usersService.findOne(createLeadDto.createdById);

    const lead = this.leadsRepository.create(createLeadDto);
    return this.leadsRepository.save(lead);
  }

  async findAll(): Promise<Lead[]> {
    return this.leadsRepository.find({
      relations: ['assignedTo', 'createdBy'],
    });
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadsRepository.findOne({
      where: { id },
      relations: ['assignedTo', 'createdBy'],
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);

    if (updateLeadDto.assignedToId) {
      await this.usersService.findOne(updateLeadDto.assignedToId);
    }

    Object.assign(lead, updateLeadDto);
    return this.leadsRepository.save(lead);
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id);
    await this.leadsRepository.remove(lead);
  }
}
