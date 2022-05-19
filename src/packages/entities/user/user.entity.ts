import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { UserRoleEntity } from './user-role.entity';
import { Payment } from '../../enum/payment.enum';

@Entity({ name: 'users' })
@Index('users-firstname-deletedat-idx', ['lastName', 'deletedAt'])
@Index('users-lastname-deletedat-idx', ['firstName', 'deletedAt'])
@Index('users-email-deletedat-idx', ['email', 'deletedAt'])
@Index('users-phone-deletedat-idx', ['phone', 'deletedAt'])
export class UserEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'first_name', length: 65 })
  @Index('users-first-name-idx', { unique: false })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name', length: 65, nullable: true })
  @Index('users-last-name-idx', { unique: false })
  lastName: string;

  @Column({ type: 'varchar', name: 'email', length: 100, nullable: true })
  @Index('users-email-idx', { unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'phone', length: 20, nullable: true })
  @Index('users-phone-idx', { unique: true })
  phone: string;

  @Column({ type: 'varchar', name: 'password', length: 100, nullable: true })
  password: string;

  @Column({
    type: 'enum',
    name: 'payment',
    enum: Payment,
    default: `${Payment.Unpaid}`,
  })
  payment: Payment;

  /*@Column({
    type: 'enum',
    name: 'notify',
    enum: Bool,
    default: `${Bool.Yes}`,
  })
  notify: Payment;*/

  @OneToMany(() => UserRoleEntity, (userRoleEntity) => userRoleEntity.user)
  @JoinColumn({ name: 'user_id' })
  roles: UserRoleEntity[];
}
