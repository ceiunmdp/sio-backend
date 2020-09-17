import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRegistrationTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Registration token to receive Firebase notifications`, example: 'token' })
  token!: string;
}
