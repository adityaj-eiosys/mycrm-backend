import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { LeadsModule } from './leads/leads.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    RolesModule,
    LeadsModule,
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
