import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private rolesService: RolesService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const role = await this.rolesService.findOne(createUserDto.roleId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roleId: createUserDto.roleId,
    });

    const savedUser = await this.usersRepository.save(user);
    const userWithRole = await this.usersRepository.findOne({
      where: { id: savedUser.id },
      relations: ['role'],
    });

    if (!userWithRole) {
      throw new Error('Failed to retrieve created user');
    }

    return userWithRole;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['role'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.roleId) {
      const role = await this.rolesService.findOne(updateUserDto.roleId);
      if (!role) {
        throw new NotFoundException('Role not found');
      }
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async updateRole(userId: string, roleId: string, currentUserId: string): Promise<User> {
    // Prevent self-role-change (security measure)
    if (userId === currentUserId) {
      throw new ConflictException('You cannot change your own role. Ask another admin to do it.');
    }

    const user = await this.findOne(userId);
    const role = await this.rolesService.findOne(roleId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    user.role = role;
    user.roleId = roleId;
    const updatedUser = await this.usersRepository.save(user);

    // Return user with role relation loaded
    const userWithRole = await this.usersRepository.findOne({
      where: { id: updatedUser.id },
      relations: ['role'],
    });

    if (!userWithRole) {
      throw new Error('Failed to retrieve updated user');
    }

    return userWithRole;
  }
}
