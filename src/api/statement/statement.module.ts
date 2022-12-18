import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatementController } from './controllers/statement.controller';
import { StatementService } from './services/statement.service';
import { ResponseService } from '../../package/services/response.service';
import { ExceptionService } from '../../package/services/exception.service';
import { RequestService } from '../../package/services/request.service';
import { PermissionService } from '../../package/services/permission.service';
import { StatementEntity } from '../../package/entities/statement/statement.entity';
import { PurposeEntity } from '../../package/entities/purpose/purpose.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatementEntity, PurposeEntity])],
  controllers: [StatementController],
  exports: [StatementService],
  providers: [
    StatementService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
})
export class StatementModule {}
