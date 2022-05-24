import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString({ message: 'New password must be a string' })
  newPassword: string;

  @ApiProperty()
  @IsString({ message: 'Confirm password must be a string' })
  confirmPassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'User ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid user ID' })
  userID: string;
}
