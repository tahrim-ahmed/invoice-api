import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { InvoiceDetailsDto } from '../invoice/invoice-details.dto';

export class CreateInvoiceDetailsDto extends InvoiceDetailsDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID('all', { message: 'Must be a valid invoice ID' })
  invoiceID: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('all', { message: 'Must be a valid product ID' })
  productID: string;
}
