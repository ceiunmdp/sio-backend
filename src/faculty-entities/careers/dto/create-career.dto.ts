import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCareerDto {
  @IsString()
  @ApiProperty({ description: `Career's name`, example: 'Software Engineering' })
  name!: string;
}
