import { IsEmail, IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  contactPerson: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsUUID()
  linkedLeadId?: string;

  @IsNotEmpty()
  @IsUUID()
  assignedManagerId: string;
}
