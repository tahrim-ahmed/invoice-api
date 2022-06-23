import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PartialPaymentDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'ID can not be empty' })
  id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Amount can not be empty' })
  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;
}
