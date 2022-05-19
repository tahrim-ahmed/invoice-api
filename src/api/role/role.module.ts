import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './service/role.service';
import { RoleController } from './controller/role.controller';
import { RoleEntity } from '../../packages/entities/user/role.entity';
import { ResponseService } from '../../packages/services/response.service';
import { ExceptionService } from '../../packages/services/exception.service';
import { RequestService } from '../../packages/services/request.service';
import { PermissionService } from '../../packages/services/permission.service';

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
