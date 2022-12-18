import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseDto } from '../core/base.dto';
import { Type } from 'class-transformer';
import { ProductDto } from '../product/product.dto';

export class StockDto extends BaseDto {
  @Type(() => ProductDto)
  product: ProductDto;

  @ApiProperty()
  @IsNotEmpty({ message: 'Quantity can not be empty' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;
}
