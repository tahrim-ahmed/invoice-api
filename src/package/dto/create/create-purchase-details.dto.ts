import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { PurchaseDetailsDto } from '../purchase/purchase-details.dto';

export class CreatePurchaseDetailsDto extends PurchaseDetailsDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID('all', { message: 'Must be a valid purchase ID' })
  purchaseID: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('all', { message: 'Must be a valid product ID' })
  productID: string;
}
