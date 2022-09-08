import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../core/base.dto';

export class ClientDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(255, { message: 'Maximum 255 characters supported' })
  code: string;

  @ApiProperty()
  @IsString({ message: 'Must be a string' })
  @MaxLength(255, { message: 'Maximum 255 characters supported' })
  name: string;

  @ApiProperty()
  @IsString({ message: 'Must be a string' })
  @MaxLength(255, { message: 'Maximum 255 characters supported' })
  proprietor: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(100, { message: 'Maximum 100 characters supported' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'Must be a string' })
  @MaxLength(20, { message: 'Maximum 20 character supported' })
  cell: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(1000, { message: 'Maximum 1000 characters supported' })
  billing: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(1000, { message: 'Maximum 1000 characters supported' })
  shipping: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(1000, { message: 'Maximum 1000 characters supported' })
  production: string;
}
