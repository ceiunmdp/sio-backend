import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCareerDto {
  @IsString()
  @ApiProperty({ description: 'Name of career' })
  name!: string;

  // @IsCareerExist({ message: 'Custom message' })
  // careerId!: string;
}
