import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { ConfigModule as NestConfigModule, ConfigService as NestConfigService } from '@nestjs/config';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [NestConfigModule],
      useFactory: (nestConfigService: NestConfigService) => {
        const expiresIn = nestConfigService.get<string>('JWT_EXPIRES_IN', '24h');
        return {
          secret: nestConfigService.get<string>('JWT_SECRET', 'your-secret-key-change-in-production'),
          signOptions: { 
            expiresIn: expiresIn as any,
          },
        };
      },
      inject: [NestConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
