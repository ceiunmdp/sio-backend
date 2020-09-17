import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateParameterDto {
  @IsNumber()
  @ApiProperty({ description: `Parameter's new value`, example: 77 })
  value!: number;
}
