import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '../core/base.dto';
import { PurchaseDto } from './purchase.dto';
import { ProductDto } from '../product/product.dto';

export class PurchaseDetailsDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Quantity can not be empty' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Unit Price can not be empty' })
  @IsNumber({}, { message: 'Unit Price must be a number' })
  unitPrice: number;

  @Type(() => ProductDto)
  product: ProductDto;

  @Type(() => PurchaseDto)
  purchase: PurchaseDto;
}
