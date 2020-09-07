import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCampusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Campus's name`, example: 'Central' })
  name!: string;
}
