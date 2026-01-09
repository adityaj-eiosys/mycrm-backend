import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsUUID()
  roleId: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
