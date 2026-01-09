import { IsEmail, IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { LeadStatus } from '../entities/lead.entity';

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}
