import { IsEmail, IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUUID()
  linkedLeadId?: string;

  @IsOptional()
  @IsUUID()
  assignedManagerId?: string;
}
