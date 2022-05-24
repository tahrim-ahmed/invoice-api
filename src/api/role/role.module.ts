import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './service/role.service';
import { RoleController } from './controller/role.controller';
import { RoleEntity } from '../../package/entities/user/role.entity';
import { ResponseService } from '../../package/services/response.service';
import { ExceptionService } from '../../package/services/exception.service';
import { RequestService } from '../../package/services/request.service';
import { PermissionService } from '../../package/services/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  exports: [RoleService],
  providers: [
    RoleService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
  controllers: [RoleController],
})
export class RoleModule {}
