import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurposeController } from './controllers/purpose.controller';
import { PurposeService } from './services/purpose.service';
import { ResponseService } from '../../package/services/response.service';
import { ExceptionService } from '../../package/services/exception.service';
import { RequestService } from '../../package/services/request.service';
import { PermissionService } from '../../package/services/permission.service';
import { PurposeEntity } from '../../package/entities/purpose/purpose.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurposeEntity])],
  controllers: [PurposeController],
  exports: [PurposeService],
  providers: [
    PurposeService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
})
export class PurposeModule {}
