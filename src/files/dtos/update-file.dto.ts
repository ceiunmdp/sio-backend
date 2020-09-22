import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `File's name`, example: 'Practice N° 1' })
  name!: string;

  constructor(partial: Partial<UpdateFileDto>) {
    Object.assign(this, partial);
  }
}
