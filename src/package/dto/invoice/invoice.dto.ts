import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
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
  @IsOptional()
  invoiceID: string;

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
  @IsNotEmpty({ message: 'Payment can not be empty' })
  @IsString({ message: 'Payment must be a string' })
  @MaxLength(255, { message: 'Payment less than 255 characters' })
  payment: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Payment type can not be empty' })
  @IsString({ message: 'Payment type must be a string' })
  @MaxLength(255, { message: 'Payment type less than 255 characters' })
  paymentType: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString({ strict: true })
  creditPeriod: Date | string;

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
  @IsNumber({}, { message: 'Total Commission must be a number' })
  totalProfit: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Others can not be empty' })
  @IsNumber({}, { message: 'Others must be a number' })
  others: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber({}, { message: 'Others must be a number' })
  paidAmount: number;

  @Type(() => ClientDto)
  client: ClientDto;

  @Type(() => InvoiceDetailsDto)
  invoiceDetails: InvoiceDetailsDto[];
}
