import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

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
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  @ApiProperty({ description: `User's password`, example: 'Password123*' })
  password!: string;
}
