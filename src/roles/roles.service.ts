import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRole } from './entities/usersRole.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(UsersRole)
    private rolesRepository: Repository<UsersRole>,
  ) {}

  async findAll(): Promise<UsersRole[]> {
    return this.rolesRepository.find();
  }

  async findOne(id: string): Promise<UsersRole | null> {
    return this.rolesRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<UsersRole | null> {
    return this.rolesRepository.findOne({ where: { name } });
  }

  async create(name: string, description?: string): Promise<UsersRole> {
    const role = this.rolesRepository.create({ name, description });
    return this.rolesRepository.save(role);
  }

  async seedRoles(): Promise<void> {
    const roles = ['ADMIN', 'SALES', 'USER'];
    for (const roleName of roles) {
      const existingRole = await this.findByName(roleName);
      if (!existingRole) {
        await this.create(roleName, `${roleName} role`);
      }
    }
  }
}
