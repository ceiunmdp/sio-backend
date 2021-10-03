import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['email']) {
  @IsBoolean()
  @ApiProperty({ description: `Whether or not the user is disabled`, example: true })
  disabled!: boolean;

  @IsBoolean()
  @ApiProperty({ name: 'dark_theme', description: `User's theme`, example: false })
  darkTheme!: boolean;
}
