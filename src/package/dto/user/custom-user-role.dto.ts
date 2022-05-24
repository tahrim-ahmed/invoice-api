import { RoleName } from '../../enum/role-name.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CustomUserRoleDto {
  @ApiProperty({ enum: RoleName, enumName: 'role name' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsEnum(RoleName, { message: 'Must be a valid role' })
  role: RoleName;
}
