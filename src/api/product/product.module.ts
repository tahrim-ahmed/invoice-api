import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ResponseService } from '../../package/services/response.service';
import { ExceptionService } from '../../package/services/exception.service';
import { RequestService } from '../../package/services/request.service';
import { PermissionService } from '../../package/services/permission.service';
import { ProductEntity } from '../../package/entities/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  exports: [ProductService],
  providers: [
    ProductService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
})
export class ProductModule {}
