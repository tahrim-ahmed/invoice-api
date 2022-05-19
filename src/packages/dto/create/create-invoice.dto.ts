import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { CreateInvoiceDetailsDto } from './create-invoice-details.dto';
import { Type } from 'class-transformer';
import { InvoiceDto } from '../invoice/invoice.dto';

export class CreateInvoiceDto extends InvoiceDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID('all', { message: 'Must be a valid Client ID' })
  clientID: string;

  @ApiProperty({
    type: [CreateInvoiceDetailsDto],
  })
  @Type(() => CreateInvoiceDetailsDto)
  @ValidateNested({
    each: true,
  })
  createInvoiceDetailsDto: CreateInvoiceDetailsDto[];
}
