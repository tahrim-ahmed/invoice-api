import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { RoleService } from '../role/service/role.service';
import { RoleController } from '../role/controller/role.controller';
import { UserEntity } from '../../package/entities/user/user.entity';
import { RoleEntity } from '../../package/entities/user/role.entity';
import { UserRoleEntity } from '../../package/entities/user/user-role.entity';
import { ResponseService } from '../../package/services/response.service';
import { BcryptService } from '../../package/services/bcrypt.service';
import { ExceptionService } from '../../package/services/exception.service';
import { RequestService } from '../../package/services/request.service';
import { PermissionService } from '../../package/services/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, UserRoleEntity])],
  exports: [UserService],
  providers: [
    UserService,
    RoleService,
    ResponseService,
    BcryptService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
  controllers: [UserController, RoleController],
})
export class UserModule {}
