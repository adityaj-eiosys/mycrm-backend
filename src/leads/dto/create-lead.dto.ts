import { IsEmail, IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { LeadStatus } from '../entities/lead.entity';

export class CreateLeadDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsNotEmpty()
  @IsUUID()
  assignedToId: string;

  @IsOptional()
  @IsUUID()
  createdById: string;
}
