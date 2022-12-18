import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '../core/base.dto';
import { PurchaseDetailsDto } from './purchase-details.dto';

export class PurchaseDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Date can not be empty' })
  @IsDateString({ strict: true })
  purchaseDate: Date | string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Total Price can not be empty' })
  @IsNumber({}, { message: 'Total Price must be a number' })
  totalPrice: number;

  @ApiProperty()
  @IsString({ message: 'Must be a valid string' })
  type: string;

  @Type(() => PurchaseDetailsDto)
  purchaseDetails: PurchaseDetailsDto[];
}
