import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { UserRoleEntity } from './user-role.entity';
import { CustomBaseEntity } from '../core/custom-base.entity';

@Entity({ name: 'roles' })
@Index('roles-role-deletedat-idx', ['role', 'deletedAt'])
export class RoleEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'role', length: 65 })
  @Index('roles-role-idx', { unique: true })
  role: string;

  @Column({ type: 'varchar', name: 'description', length: 255 })
  description: string;

  @OneToMany(() => UserRoleEntity, (userRoleEntity) => userRoleEntity.role)
  @JoinColumn({ name: 'role_id' })
  users: UserRoleEntity[];
}
