import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseDto } from '../core/base.dto';
import { UserRoleDto } from './user-role.dto';

export class RoleDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  @MaxLength(65, { message: 'Maximum 65 character supported' })
  role: string;

  @ApiProperty()
  @IsString({ message: 'Must be a string' })
  @MaxLength(512, { message: 'Maximum 512 character supported' })
  description: string;

  @Type(() => UserRoleDto)
  users: UserRoleDto[];
}
