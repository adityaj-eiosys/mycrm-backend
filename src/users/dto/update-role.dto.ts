import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsUUID()
  roleId: string;
}
