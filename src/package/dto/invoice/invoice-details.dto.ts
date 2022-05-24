import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '../core/base.dto';
import { InvoiceDto } from './invoice.dto';
import { ProductDto } from '../product/product.dto';

export class InvoiceDetailsDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Quantity can not be empty' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Uni Price can not be empty' })
  @IsNumber({}, { message: 'Unit Price must be a number' })
  unitTP: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Uni Price can not be empty' })
  @IsNumber({}, { message: 'Unit Price must be a number' })
  unitMRP: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Discount can not be empty' })
  @IsNumber({}, { message: 'Discount must be a number' })
  discount: number;

  @Type(() => ProductDto)
  product: ProductDto;

  @Type(() => InvoiceDto)
  invoice: InvoiceDto;
}
