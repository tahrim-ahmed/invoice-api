import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Bool } from '../../enum/bool.enum';

export class LoginDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  email: string;

  @ApiProperty()
  @IsDefined({ message: 'Password must be defined' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @ApiProperty({ default: 1 })
  @IsInt({ message: 'Must be an integer value' })
  @IsEnum(Bool, { message: 'Can be either 0 or 1' })
  isRemembered: Bool;
}
