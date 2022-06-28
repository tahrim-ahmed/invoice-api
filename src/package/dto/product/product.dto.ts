import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../core/base.dto';
import { InvoiceDetailsEntity } from '../../entities/invoice/invoice-details.entity';
import { Type } from 'class-transformer';
import { StockEntity } from '../../entities/stock/stock.entity';

export class ProductDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(255, { message: 'Maximum 255 characters supported' })
  name: string;

  @ApiProperty()
  @IsString({ message: 'Must be a string' })
  @MaxLength(255, { message: 'Maximum 255 characters supported' })
  packSize: string;

  @Type(() => InvoiceDetailsEntity)
  invoiceDetails: InvoiceDetailsEntity[];

  @Type(() => StockEntity)
  stock: StockEntity;
}
