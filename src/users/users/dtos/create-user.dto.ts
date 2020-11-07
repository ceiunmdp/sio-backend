import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { PASSWORD_PATTERN } from 'src/common/constants/password-pattern.constant';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ name: 'display_name', description: `User's name`, example: 'John Doe' })
  displayName!: string;

  @IsEmail()
  @ApiProperty({ description: `User's email`, example: 'example@gmail.com' })
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_PATTERN)
  @ApiProperty({ description: `User's password`, example: 'Password123*' })
  password!: string;
}
