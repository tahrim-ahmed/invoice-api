import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../core/base.dto';

export class StatementDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Purpose can not be empty' })
  @IsString({ message: 'Purpose must be a string' })
  @MaxLength(255, { message: 'Purpose less than 255 characters' })
  purpose: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Total TP can not be empty' })
  @IsNumber({}, { message: 'Total TP must be a number' })
  amount: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Reference can not be empty' })
  @IsString({ message: 'Reference must be a string' })
  @MaxLength(255, { message: 'Reference less than 255 characters' })
  referenceID: string;
}
