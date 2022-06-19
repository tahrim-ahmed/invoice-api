import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../package/entities/product/product.entity';
import { PurchaseController } from './controllers/purchase.controller';
import { PurchaseService } from './services/purchase.service';
import { ResponseService } from '../../package/services/response.service';
import { ExceptionService } from '../../package/services/exception.service';
import { RequestService } from '../../package/services/request.service';
import { PermissionService } from '../../package/services/permission.service';
import { PurchaseEntity } from '../../package/entities/purchase/purchase.entity';
import { PurchaseDetailsEntity } from '../../package/entities/purchase/purchase-details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseEntity,
      PurchaseDetailsEntity,
      ProductEntity,
    ]),
  ],
  controllers: [PurchaseController],
  providers: [
    PurchaseService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
})
export class PurchaseModule {}
