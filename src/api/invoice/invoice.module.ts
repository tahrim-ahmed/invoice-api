import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from '../../packages/entities/invoice/invoice.entity';
import { InvoiceDetailsEntity } from '../../packages/entities/invoice/invoice-details.entity';
import { ProductEntity } from '../../packages/entities/product/product.entity';
import { ClientModule } from '../client/client.module';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceService } from './services/invoice.service';
import { ResponseService } from '../../packages/services/response.service';
import { ExceptionService } from '../../packages/services/exception.service';
import { RequestService } from '../../packages/services/request.service';
import { PermissionService } from '../../packages/services/permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoiceEntity,
      InvoiceDetailsEntity,
      ProductEntity,
    ]),
    ClientModule,
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
