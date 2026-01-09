import { Controller, Post, Body, HttpCode, HttpStatus, Get, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Public } from '../common/decorators/public.decorator';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('dev-set-password')
  @Public()
  async devSetPassword(@Body() body: { email: string; password: string }) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Dev endpoint disabled in production');
    }

    const { email, password } = body;
    if (!email || !password) {
      throw new ForbiddenException('email and password required');
    }

    // ensure roles
    await this.rolesService.seedRoles();

    let user = await this.usersService.findByEmail(email);
    const adminRole = await this.rolesService.findByName('ADMIN');
    if (!adminRole) {
      throw new ForbiddenException('ADMIN role missing');
    }

    if (user) {
      // update password via service (it will hash)
      await this.usersService.update(user.id, { password } as any);
    } else {
      // create user with admin role
      const createDto: CreateUserDto = {
        fullName: 'Dev Admin',
        email,
        mobileNumber: process.env.DEV_ADMIN_MOBILE || '0000000000',
        password,
        roleId: adminRole.id,
      } as CreateUserDto;

      user = await this.usersService.create(createDto as any);
    }

    return { message: 'ok', email: user.email };
  }

  @Get('dev-token')
  @Public()
  async getDevAdminToken() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Dev token disabled in production');
    }

    // Ensure roles exist
    await this.rolesService.seedRoles();

    const adminEmail = process.env.DEV_ADMIN_EMAIL || 'admin@test.com';
    const adminPassword = process.env.DEV_ADMIN_PASSWORD || 'password';

    let user = await this.usersService.findByEmail(adminEmail);

    if (!user) {
      const adminRole = await this.rolesService.findByName('ADMIN');
      if (!adminRole) {
        throw new ForbiddenException('ADMIN role not available');
      }

      const createDto: CreateUserDto = {
        fullName: 'Dev Admin',
        email: adminEmail,
        mobileNumber: process.env.DEV_ADMIN_MOBILE || '0000000000',
        password: adminPassword,
        roleId: adminRole.id,
      } as CreateUserDto;

      user = await this.usersService.create(createDto as any);
    }

    const payload = { sub: user.id, email: user.email, role: user.role?.name ?? 'ADMIN' };
    const token = this.jwtService.sign(payload, { expiresIn: '1d' });

    return {
      access_token: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role?.name ?? 'ADMIN',
      },
    };
  }
}
