import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSeeder } from './services/role.seeder';
import { UserService } from './services/user.service';
import { UserSeeder } from './services/user.seeder';
import { UserEntity } from '../../package/entities/user/user.entity';
import { RoleEntity } from '../../package/entities/user/role.entity';
import { UserRoleEntity } from '../../package/entities/user/user-role.entity';
import { BcryptService } from '../../package/services/bcrypt.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, UserRoleEntity])],
  providers: [BcryptService, UserSeeder, RoleSeeder, UserService],
  exports: [UserService],
})
export class UserSeederModule {}
