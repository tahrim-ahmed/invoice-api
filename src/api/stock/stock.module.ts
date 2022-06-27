import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../package/entities/product/product.entity';
import { StockController } from './controllers/stock.controller';
import { StockService } from './services/stock.service';
import { ResponseService } from '../../package/services/response.service';
import { ExceptionService } from '../../package/services/exception.service';
import { RequestService } from '../../package/services/request.service';
import { PermissionService } from '../../package/services/permission.service';
import { PurchaseEntity } from '../../package/entities/purchase/purchase.entity';
import { PurchaseDetailsEntity } from '../../package/entities/purchase/purchase-details.entity';
import { StatementModule } from '../statement/statement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseEntity,
      PurchaseDetailsEntity,
      ProductEntity,
    ]),
    StatementModule,
  ],
  controllers: [StockController],
  providers: [
    StockService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
})
export class StockModule {}
