import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'users_roles' })
export class UserRoleEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.roles)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, (roleEntity) => roleEntity.users)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
