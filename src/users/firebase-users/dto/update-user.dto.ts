import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
  @IsBoolean()
  @ApiProperty({ name: 'dark_theme', description: `User's theme` })
  darkTheme!: boolean;
}
