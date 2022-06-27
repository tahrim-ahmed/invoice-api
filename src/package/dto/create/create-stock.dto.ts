import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { StockDto } from '../stock/stock.dto';

export class CreateStockDto extends StockDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('all', { message: 'Must be a valid product ID' })
  productID: string;
}
