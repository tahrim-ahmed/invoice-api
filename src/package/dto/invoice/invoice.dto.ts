import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString, IsDecimal, IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '../core/base.dto';
import { InvoiceDetailsDto } from './invoice-details.dto';
import { ClientDto } from '../client/client.dto';

export class InvoiceDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Date can not be empty' })
  @IsDateString({ strict: true })
  orderDate: Date | string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Date can not be empty' })
  @IsDateString({ strict: true })
  shippingDate: Date | string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Platform can not be empty' })
  @IsString({ message: 'Platform must be a string' })
  @MaxLength(255, { message: 'Platform less than 255 characters' })
  platform: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Total TP can not be empty' })
  @IsNumber({}, { message: 'Total TP must be a number' })
  totalTP: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Total MRP can not be empty' })
  @IsNumber({}, { message: 'Total MRP must be a number' })
  totalMRP: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Total Commission can not be empty' })
  @IsNumber({}, { message: 'Total Commission must be a number' })
  totalCommission: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Total Commission can not be empty' })
  @IsNumber({}, { message: 'Total Commission must be a number'})
  totalProfit: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Others can not be empty' })
  @IsNumber({}, { message: 'Others must be a number' })
  others: number;

  @Type(() => ClientDto)
  client: ClientDto;

  @Type(() => InvoiceDetailsDto)
  invoiceDetails: InvoiceDetailsDto[];
}
