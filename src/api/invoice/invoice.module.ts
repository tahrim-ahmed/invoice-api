import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from '../../package/entities/invoice/invoice.entity';
import { InvoiceDetailsEntity } from '../../package/entities/invoice/invoice-details.entity';
import { ProductEntity } from '../../package/entities/product/product.entity';
import { ClientModule } from '../client/client.module';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceService } from './services/invoice.service';
import { ResponseService } from '../../package/services/response.service';
import { ExceptionService } from '../../package/services/exception.service';
import { RequestService } from '../../package/services/request.service';
import { PermissionService } from '../../package/services/permission.service';
import { StatementModule } from '../statement/statement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoiceEntity,
      InvoiceDetailsEntity,
      ProductEntity,
    ]),
    ClientModule,
    StatementModule,
  ],
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
})
export class InvoiceModule {}
