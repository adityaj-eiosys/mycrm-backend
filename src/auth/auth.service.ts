import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Get default USER role if not provided
    let roleId = registerDto.roleId;
    if (!roleId) {
      let userRole = await this.rolesService.findByName('USER');
      if (!userRole) {
        // Seed roles if they don't exist
        await this.rolesService.seedRoles();
        userRole = await this.rolesService.findByName('USER');
        if (!userRole) {
          throw new Error('Failed to create default USER role');
        }
      }
      roleId = userRole.id;
    }

    // Create user
    const user = await this.usersService.create({
      ...registerDto,
      roleId,
    });

    // Ensure role is loaded
    if (!user.role) {
      throw new Error('User role not loaded');
    }

    // Generate JWT
    const payload = { sub: user.id, email: user.email, role: user.role.name };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.jwtExpiresIn as any,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      console.warn(`Auth login failed: user not found for ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.enabled) {
      console.warn(`Auth login failed: user disabled ${loginDto.email}`);
      throw new UnauthorizedException('Account is disabled');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      console.warn(`Auth login failed: wrong password for ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role.name };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.jwtExpiresIn as any,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role.name,
      },
    };
  }

  async validateUser(userId: string) {
    return this.usersService.findOne(userId);
  }
}
