import { Type } from 'class-transformer';
import { RoleDto } from './role.dto';
import { UserDto } from './user.dto';
import { BaseDto } from '../core/base.dto';

export class UserRoleDto extends BaseDto {
  @Type(() => UserDto)
  user: UserDto;

  @Type(() => RoleDto)
  role: RoleDto;
}
