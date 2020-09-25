import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCareerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Career's name`, example: 'Software Engineering' })
  name!: string;
}
