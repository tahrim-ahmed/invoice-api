import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSeeder } from './services/role.seeder';
import { UserService } from './services/user.service';
import { UserSeeder } from './services/user.seeder';
import { UserEntity } from '../../packages/entities/user/user.entity';
import { RoleEntity } from '../../packages/entities/user/role.entity';
import { UserRoleEntity } from '../../packages/entities/user/user-role.entity';
import { BcryptService } from '../../packages/services/bcrypt.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, UserRoleEntity])],
  providers: [BcryptService, UserSeeder, RoleSeeder, UserService],
  exports: [UserService],
})
export class UserSeederModule {}
