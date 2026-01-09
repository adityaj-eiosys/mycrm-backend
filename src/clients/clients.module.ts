import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities/client.entity';
import { UsersModule } from '../users/users.module';
import { LeadsModule } from '../leads/leads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    UsersModule,
    LeadsModule,
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
