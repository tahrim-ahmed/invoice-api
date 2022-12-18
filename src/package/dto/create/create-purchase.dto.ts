import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePurchaseDetailsDto } from './create-purchase-details.dto';
import { PurchaseDto } from '../purchase/purchase.dto';

export class CreatePurchaseDto extends PurchaseDto {
  @ApiProperty({
    type: [CreatePurchaseDetailsDto],
  })
  @Type(() => CreatePurchaseDetailsDto)
  @ValidateNested({
    each: true,
  })
  createPurchaseDetailsDto: CreatePurchaseDetailsDto[];
}
